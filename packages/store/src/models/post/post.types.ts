/**
 * Properties that need to be received through user input to create a new post
 */

export interface PostInsert {
  /** the title of the post */
  title: string;
  /** the content of the post */
  body: string;
  user_id: string;
  community_id: string;
}
