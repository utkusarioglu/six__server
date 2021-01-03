import auth from './methods/auth';
import { initStore } from './sets/init';
import { sessionConnector } from './connectors/session';
import postgres from './connectors/knex';

/**
 * Single source of store actions
 */
const store = {
  auth,

  /**
   * Data sources that the store is using. This object gives access to
   * raw connection objects. However, it is recommended to use the
   * customized methods (or create them) instead of relying on these
   */
  sources: {
    postgres,
  },
  /**
   * Shall be used by express-session to establish the store.
   * This method allows express-session to be agnostic about where the
   * sessions are stored
   */
  sessionConnector,
  /**
   * Initializes the tables. This shouldn't be here when the code reaches
   * production stage
   */
  initStore: () => initStore(store),
};

export default store;
