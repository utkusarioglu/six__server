import type Store from '../index';

export async function init(store: typeof Store): Promise<void> {
  await store.auth.initUsers();
  return await store.auth.createSessions();
}

export async function mockUsers(store: typeof Store): Promise<void> {
  await store.auth.clearUsers();
  return await store.auth.insertUsers([
    {
      username: 'utku',
      password: '1',
      age: 3,
    },
  ]);
}
