import auth from './methods/auth';
import { init, mockUsers } from './sets/init';

const store = {
  auth,
};

init(store).then(() => mockUsers(store));

export default store;
