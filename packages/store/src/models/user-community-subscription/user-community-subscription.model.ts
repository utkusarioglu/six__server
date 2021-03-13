import type {
  UCSCommunityId,
  UCSCommunityIdColumns,
  UCSInsertPrepareIn,
  UCSInsertPrepareOut,
  UCSUserId,
  UserCommunitySubscriptionUpPl,
} from './user-community-subscription.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class UserCommunitySubscriptionStore extends Model<UserCommunitySubscriptionUpPl> {
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

  async insert(
    input: UCSInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ) {
    const prepare = ({
      userId,
      communityId,
    }: UCSInsertPrepareIn): UCSInsertPrepareOut => ({
      user_id: userId,
      community_id: communityId,
    });

    return this._insert(
      input,
      prepare,
      ['user_id', 'community_id'],
      transaction,
      rollback
    );
  }

  async delete(userId: uuid, communityId: uuid) {
    return this._queryBuilder((table) => {
      return table.delete().where({
        user_id: userId,
        community_id: communityId,
      });
    });
  }

  async getCommunityIdsForUserId(userId: UCSUserId): Promise<UCSCommunityId[]> {
    const columns: UCSCommunityIdColumns = {
      communityId: 'community_id',
    };

    return this._queryBuilder((table) => {
      return table.select(columns).where({ user_id: userId });
    });
  }

  async selectForUserAndCommunity(
    userId: uuid,
    communityId: uuid
  ): Promise<void | string> {
    return this._queryBuilder((table) => {
      return table
        .first({ userId: 'user_id', communityId: 'community_id' })
        .where({ user_id: userId, community_id: communityId });
    });
  }
}

export default new UserCommunitySubscriptionStore({
  singular: 'user_community_subscription',
  plural: 'user_community_subscriptions',
  connector: postgres,
});
