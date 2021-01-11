import store from 'six__server__store';
import {
  USERS,
  COMMUNITIES,
  POSTS,
  VISITOR_COMMUNITIES,
  USER_COMMUNITY_SUBSCRIPTIONS,
} from './constants';

async function mockUsers(): Promise<void> {
  await store.user.deleteAll();
  await store.user.insert(USERS);
}

async function mockCommunities(): Promise<void> {
  await store.community.deleteAll();
  await store.community.insert(COMMUNITIES);

  await store.visitorCommunitySubscription.deleteAll();
  await store.visitorCommunitySubscription.insert(VISITOR_COMMUNITIES);

  await store.userCommunitySubscription.insert(USER_COMMUNITY_SUBSCRIPTIONS);
}

async function mockComments() {
  await store.comment.deleteAll();
}

async function mockVotes() {
  await store.vote.deleteAll();
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

/***
 * Clears n-ary associations from the store
 */
async function clearNaryAssociations() {
  await store.commentVote.deleteAll();
  await store.communityPost.deleteAll();
  await store.postVote.deleteAll();
  await store.userComment.deleteAll();
  await store.userCommunityCreator.createTable();
  await store.userCommunitySubscription.deleteAll();
  await store.userPost.deleteAll();
  await store.userVote.deleteAll();
}

/**
 * Creates mock data for development purposes
 *
 * @privateRemarks
 * This function should not be called in production
 */
export async function createMockData(): Promise<void> {
  // await clearNaryAssociations();
  await mockUsers();
  await mockCommunities();
  await mockVotes();
  await mockPosts();
  await mockComments();
}
