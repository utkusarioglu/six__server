import auth from './methods/auth';
import { initStore } from './sets/init';

/**
 * Single source of store actions
 */
const store = {
  auth,
};

/**
 * Initializes the tables. This shouldn't be here when the code reaches
 * production stage
 */
initStore(store);

export default store;
