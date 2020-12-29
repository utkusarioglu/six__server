import auth from './methods/auth';

const store = {
  auth,
};

store.auth.createUsersTableIfNotExist().then(() => {
  store.auth.insertUsers([
    {
      name: 'utku',
      password: 'utku',
      age: 3,
    },
  ]);
});
export default store;
