import type Store from '../index';

/**
 * Initializes everything that the app needs for the store to function
 * @param store store object that contains access to all data sources
 */
export async function initStore(store: typeof Store): Promise<void> {
  // entities
  await store.user.createTable();
  await store.comment.createTable();
  await store.post.createTable();
  await store.community.createTable();
  await store.vote.createTable();
  await store.userContent.createTable();

  // associations
  await store.commentVote.createTable();
  await store.communityPost.createTable();
  await store.postComment.createTable();
  await store.postVote.createTable();
  await store.userComment.createTable();
  await store.userCommunityCreator.createTable();
  await store.userCommunitySubscription.createTable();
  await store.userPost.createTable();
  await store.userVote.createTable();
  await store.visitorCommunitySubscription.createTable();
  await store.postUserContent.createTable();

  return;
}
