import store from 'six__server__store';
import {
  USERS,
  COMMUNITIES,
  POSTS,
  VISITOR_COMMUNITIES,
  USER_COMMUNITY_SUBSCRIPTIONS,
  USER_CONTENTS,
} from './constants';
import { NODE_ENV } from 'six__server__global';

async function mockUsers(): Promise<void> {
  await store.user.deleteAll();
  await store.user._insert(USERS);
}

async function mockCommunities(): Promise<void> {
  await store.community.deleteAll();
  await store.community._insert(COMMUNITIES);

  await store.visitorCommunitySubscription.deleteAll();
  await store.visitorCommunitySubscription._insert(VISITOR_COMMUNITIES);

  await store.userCommunitySubscription._insert(USER_COMMUNITY_SUBSCRIPTIONS);
}

async function mockComments() {
  await store.comment.deleteAll();
}

async function mockVotes() {
  await store.vote.deleteAll();
}

async function mockUserContents() {
  await store.userContent.deleteAll();
  await store.userContent._insert(USER_CONTENTS);
}

/**
 * Creates mock posts library
 */
async function mockPosts(): Promise<void> {
  // await store.post.deleteAll();

  await POSTS.reduce((chain, post) => {
    chain = chain.then(() => {
      store.post.insert(post);
    });
    return chain;
  }, Promise.resolve());
}

/**
 * Creates mock data for development purposes
 *
 * @privateRemarks
 * This function should not be called in production
 */
export async function createMockData(): Promise<void> {
  if (NODE_ENV === 'test') return Promise.resolve();
  // await clearNaryAssociations();
  await mockUsers();
  await mockUserContents();
  await mockCommunities();
  await mockVotes();
  await mockPosts();
  // await mockComments();
}
