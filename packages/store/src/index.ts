import { initStore } from './migrations/init';
import { sessionConnector } from './connectors/session';
import postgres from './connectors/postgres';

import user from './models/user/user';
import comment from './models/comment/comment';
import post from './models/post/post';
import community from './models/community/community';
import commentVote from './models/comment-vote/comment-vote';
import communityPost from './models/community-post/community-post';
import postComment from './models/post-comment/post-comment';
import postVote from './models/post-vote/post-vote';
import userComment from './models/user-comment/user-comment';
import userCommunityCreator from './models/user-community-creator/user-community-creator';
import userCommunitySubscription from './models/user-community-subscription/user-community-subscription';
import userPost from './models/user-post/user-post';
import userVote from './models/user-vote/user-vote';
import vote from './models/vote/vote';
import visitorCommunitySubscription from './models/visitor-community-subscription/visitor-community-subscription';

/**
 * Single source of store actions
 */
const store = {
  user,
  comment,
  post,
  community,
  commentVote,
  communityPost,
  postComment,
  postVote,
  userComment,
  userCommunityCreator,
  userCommunitySubscription,
  userPost,
  userVote,
  vote,
  visitorCommunitySubscription,

  /**
   * Data sources that the store is using. This object gives access to
   * raw connection objects. However, it is recommended to use the
   * customized methods (or create them) instead of relying on these
   */
  sources: {
    postgres,
  },
  /**
   * Shall be used by express-session to establish the store.
   * This method allows express-session to be agnostic about where the
   * sessions are stored
   */
  sessionConnector,
  /**
   * Initializes the tables. This shouldn't be here when the code reaches
   * production stage
   */
  initStore: () => initStore(store),
};

export default store;
