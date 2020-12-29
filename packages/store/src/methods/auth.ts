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
 * Serializes the session info to database. Used by passport to serialize
 * user information for the session
 * @param user user map defined by {@link User}
 */
async function serializeUser(user: User) {
  await postgres('sessions')
    .insert<Session>({
      username: user.username,
      user_id: user.id,
    })
    .catch(console.error);
  return user.id;
}

/**
 * Returns the user info for the id given. Used by passport to
 * deserialize the session
 * @param id user.id from {@link User}
 */
async function deserializeUser(id: string) {
  return await postgres('sessions')
    .where({ user_id: id })
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
  return (
    postgres.schema
      .createTableIfNotExists('users', (table) => {
        table.increments('id');
        table.string('username');
        // TODO create a custom domain for this if in production
        table.string('password');
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
async function insertUsers(users: DbUser[]) {
  return postgres('users')
    .insert(users)
    .then(() => console.log('users inserted'))
    .catch(console.log);
}

/**
 * Creates sessions table in postgres if it doesn't already exist
 */
async function createSessions() {
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
      .catch(console.log)
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
  console.log('user', user);
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
};

export interface DbUser {
  username: string;
  password: string;
  age: number;
}

export interface Session {
  username: string;
  user_id: string;
}
