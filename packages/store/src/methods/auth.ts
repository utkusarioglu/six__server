import postgres from '../connectors/knex';
import { ENV } from '../config';
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
  const users = await postgres('users').where({ username, password });

  if (users.length === 1) {
    return users[0];
  } else {
    return false;
  }
}

/**
 * Returns the user row from the users table that has the given usernameField
 * @param username username string
 * @returns false if there is no match, also false if there are somehow more
 * than one matches. It returns the user {@link User} if there is only one match
 */
async function getUserByUsername(username: string): Promise<User | false> {
  const user = await postgres('users').where({ username });
  if (user.length !== 1) {
    return Promise.resolve(false);
  } else {
    return user[0];
  }
}

/**
 * Serializes the session info to database. Used by passport to serialize
 * user information for the session
 * @param user user map defined by {@link User}
 */
async function serializeUser(user: User) {
  await postgres('sessions')
    .insert<SessionModel>({
      username: user.username,
      user_id: user.user_id,
    })
    .catch(console.error);
  return user.user_id;
}

/**
 * Returns the user info for the id given. Used by passport to
 * deserialize the session
 * @param user_id user.id from {@link User}
 */
async function deserializeUser(user_id: string) {
  return await postgres('sessions')
    .where({ user_id })
    .then((sessions) => {
      if (sessions.length === 1) {
        return sessions[0];
      } else {
        return false;
      }
    })
    .catch(console.error);
}

/**
 * Creates the users table
 */
async function initUsers() {
  const hasTable = await postgres.schema.hasTable('users');

  if (hasTable) {
    return;
  }

  return (
    postgres.schema
      .createTable('users', (table) => {
        table.increments('id');
        table.string('user_id');
        table.string('username');
        // TODO create a custom domain for this if in production
        table.string('password');
        table.string('email');
        table.integer('age');
      })
      .then(() => console.log('Users table created'))
      // TODO graceful error handling
      .catch(console.log)
  );
}

/**
 * Clears all the entries in Users table
 * This method is useful for development and testing environment
 * Due to its volatile behavior, the method is set to quit if called
 * in production
 */
async function clearUsers() {
  if (ENV === 'production') {
    console.warn(
      'store.auth.clearUsersTable was called while in production, ignoring'
    );
    return Promise.resolve();
  }
  return postgres('users')
    .del()
    .then(() => console.log('users table cleared'))
    .catch(console.error);
}

/**
 * Inserts a set of users
 * @param users users array
 */
async function insertUsers(users: UserModel[]) {
  return postgres('users')
    .insert(users)
    .then(() => console.log('users inserted'))
    .catch(console.log);
}

/**
 * Inserts the given user information to the database
 * @param user user object
 */
async function insertUser(user: UserModel) {
  return postgres('users')
    .insert(user)
    .then(() => console.log('user inserted', user))
    .catch(console.error);
}

/**
 * Creates sessions table in postgres if it doesn't already exist
 */
async function createSessions() {
  const hasTable = await postgres.schema.hasTable('sessions');

  if (hasTable) {
    return;
  }

  return (
    postgres.schema
      .createTableIfNotExists('sessions', (table) => {
        table.increments('id');
        table.string('username');
        table.string('user_id');
        table.timestamp('created_at').defaultTo(postgres.fn.now());
      })
      .then(() => console.log('sessions table created'))
      // TODO graceful error handling
      .catch(console.error)
  );
}

/**
 * Clears sessions table
 * Because of its volatile behavior, shall not work in production.
 * Current implementation puts a console.error and then returns without
 * clearing the table.
 */
async function clearSessions(): Promise<void> {
  if (ENV === 'production') {
    console.error('store.auth.clearSessions called in production, quitting');
    return Promise.resolve();
  }
  return postgres('sessions').del();
}

/**
 * Removes session with the given id from the sessions table
 * @param user_id id for the session to be removed
 */
async function removeSession(user: any): Promise<void> {
  await postgres('sessions')
    .where({ user_id: user.user_id })
    .del()
    .catch(console.error);
}

export default {
  loginWithUsernameAndPassword,
  serializeUser,
  deserializeUser,
  initUsers,
  insertUsers,
  clearUsers,
  createSessions,
  clearSessions,
  removeSession,
  getUserByUsername,
  insertUser,
};

export interface UserModel {
  user_id: string;
  username: string;
  password: string;
  email: string;
  age: number;
}

export interface SessionModel {
  username: string;
  user_id: string;
}
