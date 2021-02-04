import { uuid } from '../../@types/helpers';

/**
 * Properties required for associating posts with user content
 */
export interface PostUserContentInsert {
  post_id: string; //uuid
  user_content_id: string; //uuid
}

export interface PostUserContentSqlAutoInsert {
  id: uuid;
}

export type PostUserContentModel = PostUserContentInsert &
  PostUserContentSqlAutoInsert;
