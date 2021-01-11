import postgres from '../../connectors/postgres';
import type { User } from 'six__server__auth/src/@types/user';
import { Model } from '../model/model';
import { UserInsert } from './user.types';

export class UserStore extends Model<UserInsert> {
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
      t.uuid('id').primary().defaultTo(postgres.raw('uuid_generate_v4()'));
      t.string('username');
      // TODO create a custom domain for this if in production
      t.string('password');
      t.string('email');
      t.integer('age');
    });
  }

  /**
   * Returns the user row from the users table that has the given usernameField
   * @param username username string
   * @returns false if there is no match, also false if there are somehow more
   * than one matches. It returns the user {@link User} if there is only one match
   */
  async selectByUsername(username: string): Promise<User | false> {
    return this._queryBuilder((table) => {
      return table.where({ username }).then((user) => {
        if (user.length !== 1) {
          return Promise.resolve(false);
        } else {
          return user[0];
        }
      });
    });
  }
}

export default new UserStore({
  singular: 'user',
  plural: 'users',
  connector: postgres,
});
