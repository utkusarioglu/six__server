import type {
  UserCommunityCreatorUpPl,
  UccPrepareInsertIn,
  UccPrepareInsertOut,
  UccInsertOut,
} from './user-community-creator.model.types';
import type { Transaction } from 'knex';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

export class UserCommunityCreatorStore extends Model<UserCommunityCreatorUpPl> {
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
    input: UccPrepareInsertIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<void | UccInsertOut> {
    const prepare = ({
      communityId,
      userId,
    }: UccPrepareInsertIn): UccPrepareInsertOut => ({
      community_id: communityId,
      user_id: userId,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new UserCommunityCreatorStore({
  singular: 'user_community_creator',
  plural: 'user_community_creators',
  connector: postgres,
});
