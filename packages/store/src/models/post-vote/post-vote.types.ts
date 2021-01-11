export interface PostVoteInsert {
  /** The post_id of the post to which the like is granted */
  post_id: string;
  /** The user_id of the user whom likes the post */
  vote_id: string;
}
