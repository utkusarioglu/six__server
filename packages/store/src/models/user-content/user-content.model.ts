import type {
  UserContentUpPl,
  UserContentInsertPrepareIn,
  UserContentInsertPrepareOut,
} from './user-content.model.types';
import type { Transaction } from 'knex';
import type { uuid } from '../../@types/helpers.types';
import postgres from '../../connectors/postgres';
import { Model } from '../../helpers/model/model';

/**
 * Represents uploaded user content
 */
export class UserContentStore extends Model<UserContentUpPl> {
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

  async insert(
    input: UserContentInsertPrepareIn,
    transaction: Transaction,
    rollback?: () => void
  ): Promise<{ id: uuid }[] | void> {
    const prepare = ({
      filename,
      type,
    }: UserContentInsertPrepareIn): UserContentInsertPrepareOut => ({
      filename,
      type,
    });

    return this._insert(input, prepare, ['id'], transaction, rollback);
  }
}

export default new UserContentStore({
  singular: 'user_content',
  plural: 'user_contents',
  connector: postgres,
});
