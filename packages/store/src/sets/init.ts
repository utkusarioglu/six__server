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
      password: '$2b$10$P8C2Ul/ONsXO93qn4be5WOcfbCW7bby3dE6roKnWZhMcZ6q9etQsu',
      age: 3,
    },
  ]);
}
