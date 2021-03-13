import type Store from '../index';

/**
 * Initializes everything that the app needs for the store to function
 * @param store store object that contains access to all data sources
 */
export async function initStore(store: typeof Store): Promise<void> {
  // entities
  await store.models.user.createTable();
  await store.models.comment.createTable();
  await store.models.post.createTable();
  await store.models.community.createTable();
  await store.models.vote.createTable();
  await store.models.userContent.createTable();

  // associations
  await store.models.commentVote.createTable();
  await store.models.communityPost.createTable();
  await store.models.postComment.createTable();
  await store.models.postVote.createTable();
  await store.models.userComment.createTable();
  await store.models.userCommunityCreator.createTable();
  await store.models.userCommunitySubscription.createTable();
  await store.models.userPost.createTable();
  await store.models.userVote.createTable();
  await store.models.visitorCommunitySubscription.createTable();
  await store.models.postUserContent.createTable();

  return;
}
