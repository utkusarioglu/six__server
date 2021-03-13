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
  await store.models.user.deleteAll();
  await store.models.user._insert_old(USERS);
}

async function mockCommunities(): Promise<void> {
  await store.models.community.deleteAll();
  await store.models.community._insert_old(COMMUNITIES);

  await store.models.visitorCommunitySubscription.deleteAll();
  await store.models.visitorCommunitySubscription._insert_old(
    VISITOR_COMMUNITIES
  );

  await store.models.userCommunitySubscription._insert_old(
    USER_COMMUNITY_SUBSCRIPTIONS
  );
}

async function mockComments() {
  await store.models.comment.deleteAll();
}

async function mockVotes() {
  await store.models.vote.deleteAll();
}

async function mockUserContents() {
  await store.models.userContent.deleteAll();
  await store.models.userContent._insert_old(USER_CONTENTS);
}

/**
 * Creates mock posts library
 */
async function mockPosts(): Promise<void> {
  await store.models.post.deleteAll();

  await POSTS.reduce((chain, post) => {
    chain = chain.then(() => {
      store.posts.create(post);
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
