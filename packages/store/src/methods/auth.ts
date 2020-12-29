import postgres from '../connectors/knex';
import type { User } from 'six__server__auth/src/@types/user';

/**
 * Used by passport local strategy to login users
 * @param username
 * @param password
 */
async function loginWithUsernameAndPassword(
  username: string,
  password: string
) {
  if (username === 'utku' && password === '1') {
    return {
      id: 'utku',
      name: 'utku',
      motto: 'omg is this real?',
    };
  } else {
    false;
  }
}

/**
 * Serializes the session info to database. Used by passport to serialize
 * user information for the session
 * @param user user map defined by {@link User}
 */
async function serializeUser(user: User) {
  serialStore[user.id] = user;
  return Promise.resolve(user.id);
}

/**
 * Returns the user info for the id given. Used by passport to
 * deserialize the session
 * @param id user.id from {@link User}
 */
async function deserializeUser(id: string) {
  return Promise.resolve(serialStore[id]);
}

/**
 * Creates the users table
 */
async function createUsersTableIfNotExist() {
  return (
    postgres.schema
      .createTableIfNotExists('users', (table) => {
        table.increments('id');
        table.string('name');
        // !create a custom domain for this if in production
        table.string('password');
        table.integer('age');
      })
      .then(() => console.log('Users table created'))
      // TODO graceful error handling
      .catch(console.log)
  );
}

/**
 * Inserts a set of users
 * @param users users array
 */
async function insertUsers(users: DbUser[]) {
  return postgres('users').insert(users).then(console.log).catch(console.log);
}

const serialStore: { [id: string]: User } = {};

export default {
  loginWithUsernameAndPassword,
  serializeUser,
  deserializeUser,
  createUsersTableIfNotExist,
  insertUsers,
};

export interface DbUser {
  name: string;
  password: string;
  age: number;
}
