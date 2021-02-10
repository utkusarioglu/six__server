import express from 'express';
import store from 'six__server__store';
import type {
  PostsGetRes,
  CommentsGetRes,
  CommunitiesGetRes,
  UserCommunitySubscriptionCreateReqParams,
  UserCommunitySubscriptionCreatePostReq,
  UserCommunitySubscriptionCreatePostRes,
  UserCommunitySubscriptionRemovePostReq,
  UserCommunitySubscriptionRemovePostRes,
} from 'six__public-api';
import { v4 as uuid } from 'uuid';

const router = express.Router();

router.get('/headers', (req, res) => {
  res.json({
    route: 'headers',
    headers: req.headers,
    ip: req.ip,
    hostname: req.hostname,
    protocol: req.protocol,
    resHeaders: res.getHeaders(),
    reqCookies: req.cookies,
    session: req.session,
  });
});

router.get('/posts', async (req, res) => {
  const postsList =
    req.isAuthenticated() && req.user.id
      ? await store.post.selectUserPosts(req.user.id)
      : await store.post.selectVisitorPosts();

  const postsResponse: PostsGetRes = {
    id: uuid(),
    res: postsList,
  };

  res.json(postsResponse);
});

router.get('/post/slug/:postSlug/comments', async (req, res) => {
  const postSlug = req.params.postSlug;

  const commentsList = await store.comment.selectByPostSlug(postSlug);

  const commentsResponse: CommentsGetRes = {
    id: uuid(),
    res: commentsList,
  };

  console.log(commentsResponse);

  res.json(commentsResponse);
});

router.get('/post/slug/:postSlug', async (req, res) => {
  const postSlug = req.params.postSlug;

  const postsList = await store.post
    .selectPostBySlug(postSlug)
    .then((posts) => posts.pop())
    .catch((e) => console.error(e));

  const postsResponse: PostsGetRes = {
    id: uuid(),
    res: postsList,
  };

  res.json(postsResponse);
});

router.get('/communities', async (req, res) => {
  const communitiesList =
    (await store.community.selectAllForCommunityFeed()) || [];

  const communitiesResponse: CommunitiesGetRes = {
    id: uuid(),
    res: communitiesList,
  };

  res.json(communitiesResponse);
});

router.post<UserCommunitySubscriptionCreateReqParams>(
  '/user/:userId/subscribe/:communityId',
  async (req, res) => {
    const { userId, communityId } = req.params;
    try {
      const subscription = await store.userCommunitySubscription.insert({
        user_id: userId,
        community_id: communityId,
      });

      if (subscription) {
        const response: UserCommunitySubscriptionCreatePostRes = {
          id: 'some_id',
          res: {
            communityId: subscription[0].community_id,
            userId: subscription[0].user_id,
          },
        };
        res.json(response);
      } else {
        res.json({
          id: 'some id',
          error: 'something went wrong with subscription save',
        });
      }
    } catch (error) {
      res.json({
        id: 'some id',
        error,
      });
    }
  }
);

export default router;
