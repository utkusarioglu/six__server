import type {
  PostEp,
  CommentEp,
  CommunityEp,
  UserEp,
  VoteTypes,
  UserLoginResSuccessful,
} from 'six__public-api';
import type { ErrorsOut } from './@types/errors-out';

/**
 * Posts
 */
export type PostComments = PostEp['_comments']['_v1'];
export type PostCommentsOut = PostComments['_get']['_res']['Success']['body'];

export type PostVote = PostEp['_vote']['_v1'];
export type PostVoteIn = PostVote['_post']['_req']['Body'];
export type PostVoteOut = PostVote['_post']['_res']['Success']['body'];

type PostCreate = PostEp['_create']['_v1'];
export type PostCreateIn = PostCreate['_post']['_req']['Body'];
export type PostCreateOut = PostCreate['_post']['_res']['Success']['body'];

export type PostList = PostEp['_list']['_v1'];
export type PostListOut = PostList['_get']['_res']['Success']['body'];

export type PostDetails = PostEp['_single']['_v1'];
export type PostDetailsOut = PostDetails['_get']['_res']['Success']['body'];

/**
 * Comments
 */
export type CommentSave = CommentEp['_save']['_v1'];
export type CommentSaveIn = CommentSave['_post']['_req']['Body'];
export type CommentSaveOut = CommentSave['_post']['_res']['Success']['body'];

type CommentSingle = CommentEp['_single']['_v1'];
export type CommentForPostId = CommentSingle['_get']['_res']['Success']['body'];

type CommentVoteGive = CommentEp['_vote']['_give']['_v1'];
export type CommentVoteGiveRequestIn = CommentVoteGive['_post']['_req']['Body'];

/**
 * Community
 */
export type CommunityList = CommunityEp['_list']['_v1'];
export type CommunityListOut = CommunityList['_get']['_res']['Success']['body'];

export type CommunitySingle = CommunityEp['_single']['_v1'];
export type CommunitySingleOut = CommunitySingle['_get']['_res']['Success']['body'];

export type CommunityCreate = CommunityEp['_create']['_v1'];
export type CommunityCreateIn = CommunityCreate['_post']['_req']['Body'];
export type CommunityCreateOut = CommunityCreate['_post']['_res']['Success']['body'];

/**
 * Vote
 */
export type { VoteTypes };

/**
 * User
 */
export type UserSession = UserEp['_session']['_v1'];
export type UserSessionOut = UserSession['_get']['_res']['Success']['body'];

export type UserSignup = UserEp['_signup']['_v1'];
export type UserSignupIn = UserSignup['_post']['_req']['Body'];
export type UserSignupOut = UserSignup['_post']['_res']['Success']['body'];
export type UserSingupResponseErrors = ErrorsOut<UserSignupIn>;

export type UserUcsAlter = UserEp['_user_community_subscription']['_ucs']['_v1'];
export type UserUcsAlterIn = UserUcsAlter['_post']['_req']['Body'];
export type UserUcsAlterOut = UserUcsAlter['_post']['_res']['Success']['body'];

export type UserUcsIdList = UserEp['_user_community_subscription']['_id_list']['_v1'];
export type UserUcsIdListInParams = UserUcsIdList['_get']['_req']['Params'];
export type UserUcsIdListOut = UserUcsIdList['_get']['_res']['Success']['body'];

export type UserLogin = UserEp['_login']['_v1'];

export type UserLogout = UserEp['_logout']['_v1'];

export type { UserLoginResSuccessful };
