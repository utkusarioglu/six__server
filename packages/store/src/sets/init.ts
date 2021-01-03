import type Store from '../index';

export async function initStore(store: typeof Store): Promise<void> {
  return await store.auth.initUsers();
  // return await store.auth.createSessions();
}
