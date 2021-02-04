import {
  PostSqlAutoSave,
  PostPostReq,
  PostStoreAutoSave,
  PostGetRes,
} from 'six__public-api';

/**
 * Properties that need to be received through user input to create a new post
 */
export interface PostInsert {
  /** the title of the post */
  title: PostPostReq['req']['postTitle'];
  /** the content of the post */
  body: PostPostReq['req']['postBody'];
  cover_image_path?: PostPostReq['req']['mediaImagePath'];
  user_id: PostPostReq['req']['userId'];
  community_id: PostPostReq['req']['communityId'];
}

export interface PostInsertNodeAuto {
  /** url-safe version of the title */
  slug: PostStoreAutoSave['postSlug'];
}

export type PostInsertComputed = PostInsert & PostInsertNodeAuto;

export interface PostInsertAuto {
  id: PostSqlAutoSave['id'];
  created_at: PostSqlAutoSave['createdAt'];
  like_count: PostSqlAutoSave['likeCount'];
  dislike_count: PostSqlAutoSave['dislikeCount'];
  comment_count: PostSqlAutoSave['commentCount'];
  unique_commenter_count: PostSqlAutoSave['uniqueCommenterCount'];
}

export type PostModel = PostInsert & PostInsertAuto & PostInsertNodeAuto;

/**
 * This removes the need to configure jest to know about the public api
 */
export type PostGetResInternal = PostGetRes;
