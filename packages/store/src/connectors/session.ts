import type expressSession from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';

/**
 * Connects the session with the session store preferred in the project
 * This method acts as an adapter that removes mutual awareness between
 * express-session and the storage layer used for session
 * @param session session object from {@link express-session}
 */
export function sessionConnector(session: typeof expressSession) {
  const client = redis.createClient({
    host: 'redis',
    port: 6379,
  });

  return new (connectRedis(session))({ client });
}
