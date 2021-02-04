import postgres from '../../connectors/postgres';
import { Model } from '../model/model';
import type { UserContentInsert, UserContentModel } from './user-content.types';

/**
 * Represents uploaded user content
 */
export class UserContentStore extends Model<
  UserContentInsert,
  UserContentModel
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
    return this._createTable((table) => {
      table.uuid('id').primary().defaultTo(this._raw('uuid_generate_v4()'));
      table.string('filename');
      table.string('type'); // maybe there is a mime type option for this
    });
  }
}

export default new UserContentStore({
  singular: 'user_content',
  plural: 'user_contents',
  connector: postgres,
});
