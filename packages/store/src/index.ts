import auth from './methods/auth';

const store = {
  auth,
};

store.auth
  .initUsers()
  .then(() => store.auth.clearUsers())
  .then(() => {
    store.auth.insertUsers([
      {
        name: 'utku',
        password: 'utku',
        age: 3,
      },
    ]);
  });
export default store;
