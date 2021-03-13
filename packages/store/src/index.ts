import { initStore } from './migrations/init';
import { sessionConnector } from './connectors/session';
import postgres from './connectors/postgres';
// models
import user from './models/user/user.model';
import comment from './models/comment/comment.model';
import post from './models/post/post.model';
import community from './models/community/community.model';
import commentVote from './models/comment-vote/comment-vote.model';
import communityPost from './models/community-post/community-post.model';
import postComment from './models/post-comment/post-comment.model';
import postVote from './models/post-vote/post-vote.model';
import userComment from './models/user-comment/user-comment.model';
import userCommunityCreator from './models/user-community-creator/user-community-creator.model';
import userCommunitySubscription from './models/user-community-subscription/user-community-subscription.model';
import userPost from './models/user-post/user-post.model';
import userVote from './models/user-vote/user-vote.model';
import vote from './models/vote/vote.model';
import visitorCommunitySubscription from './models/visitor-community-subscription/visitor-community-subscription.model';
import userContent from './models/user-content/user-content.model';
import postUserContent from './models/post-user-content/post-user-content.model';
// accessors
import posts from './accessors/posts/posts.accessor';
import comments from './accessors/comments/comments.accessor';
import communities from './accessors/communities/communities.accessor';
import users from './accessors/users/users.accessor';

/**
 * Single source of store actions
 */
const store = {
  posts,
  comments,
  communities,
  users,

  models: {
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
    userContent,
    postUserContent,
  },

  /**
   * Data sources that the store is using. This object gives access to
   * raw connection objects. However, it is recommended to use the
   * customized methods (or create them) instead of relying on these
   */
  connectors: {
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
