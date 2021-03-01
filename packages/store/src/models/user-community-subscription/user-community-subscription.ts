import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import {
  UCSCommunityId,
  UCSInput,
  UCSPrepareInsert,
  UCSUserId,
  UserCommunitySubscriptionPipeline,
} from './user-community-subscription.types';

export class UserCommunitySubscriptionStore extends Model<UserCommunitySubscriptionPipeline> {
  /**
   * Creates the respective table in the connected database.
   * Creation only happens if a table with the name {@link this.plural}
   * does not exist. This check does not take into account the structure
   * of the preexisting table
   *
   * @privateRemarks
   * Please be familiar with the workings of {@link Model._createTable}
   * Before using this method
   */
  async createTable() {
    return this._createTable((t) => {
      t.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      t.uuid('user_id');
      t.uuid('community_id');

      t.foreign('user_id')
        .references('users.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
      t.foreign('community_id')
        .references('communities.id')
        .onDelete('CASCADE')
        .onUpdate('CASCADE');
    });
  }

  private prepareInsert({ userId, communityId }: UCSInput): UCSPrepareInsert {
    return {
      insert: {
        user_id: userId,
        community_id: communityId,
      },
      foreign: {},
    };
  }

  insert(ucsInput: UCSInput) {
    const { insert } = this.prepareInsert(ucsInput);
    return this._insert(insert, ['user_id', 'community_id']);
  }

  delete(communityId: string) {
    return this._queryBuilder((table) => {
      return table.delete().where({ community_id: communityId });
    });
  }

  getCommunityIdsForUserId(userId: UCSUserId): Promise<UCSCommunityId[]> {
    return this._queryBuilder((table) => {
      return table.select(['community_id ']).where({ user_id: userId });
      // @ts-ignore
    }).then((rows) => rows.map((row) => row.community_id));
  }
}

export default new UserCommunitySubscriptionStore({
  singular: 'user_community_subscription',
  plural: 'user_community_subscriptions',
  connector: postgres,
});
