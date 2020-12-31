import auth from './methods/auth';
import { initStore } from './sets/init';

const store = {
  auth,
};

initStore(store);

export default store;
