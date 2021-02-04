import postgres from '../../connectors/postgres';
import { Model } from './../model/model';
import {
  UserCommunityCreatorInsert,
  UserCommunityCreatorModel,
} from './user-community-creator.types';

export class UserCommunityCreatorStore extends Model<
  UserCommunityCreatorInsert,
  UserCommunityCreatorModel
> {
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
}

export default new UserCommunityCreatorStore({
  singular: 'user_community_creator',
  plural: 'user_community_creators',
  connector: postgres,
});
