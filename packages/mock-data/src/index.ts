import store from 'six__server__store';

async function mockUsers(): Promise<void> {
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

/**
 * Creates mock data for development purposes.
 *
 * @privateRemarks
 * This function should not be called in production
 */
export async function createMockData(): Promise<void> {
  return await mockUsers();
}
