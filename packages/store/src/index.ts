import type { User } from 'six__server__auth/src/@types/user';

const store = {
  login: {
    /**
     * Used by passport local strategy to login users
     * @param username
     * @param password
     */
    withUsernameAndPassword: async (username: string, password: string) => {
      if (username === 'utku' && password === '1') {
        return {
          id: 'utku',
          name: 'utku',
          motto: 'omg is this real?',
        };
      } else {
        false;
      }
    },

    /**
     * Serializes the session info to database. Used by passport to serialize
     * user information for the session
     * @param user user map defined by {@link User}
     */
    serializeUser: async (user: User) => {
      serialStore[user.id] = user;
      return Promise.resolve(user.id);
    },

    /**
     * Returns the user info for the id given. Used by passport to
     * deserialize the session
     * @param id user.id from {@link User}
     */
    deserializeUser: async (id: string) => {
      return Promise.resolve(serialStore[id]);
    },
  },

  test: {
    string: () => 'store.test.string',
  },
};

const serialStore: { [id: string]: User } = {};

export default store;
