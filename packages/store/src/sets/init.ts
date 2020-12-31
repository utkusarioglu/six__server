import type Store from '../index';

export async function init(store: typeof Store): Promise<void> {
  await store.auth.initUsers();
  return await store.auth.createSessions();
}

export async function mockUsers(store: typeof Store): Promise<void> {
  await store.auth.clearUsers();
  return await store.auth.insertUsers([
    {
      user_id: 'fced7bf2-fa80-46fe-b83b-0cae45ca5db0',
      username: 'utkusarioglu',
      password: '$2b$10$7O1nkhhxET9jgLY3FvAWseEgM5qELRtqeqlef051y3r9FD/XTwUZC',
      email: 'utkusarioglu@gmail.com',
      age: 36,
    },
  ]);
}
