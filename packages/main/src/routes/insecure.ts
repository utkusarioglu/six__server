import express from 'express';
import store from 'six__server__store';

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
  const posts =
    req.isAuthenticated() && req.user.id
      ? await store.post.selectUserPosts(req.user.id)
      : await store.post.selectVisitorPosts();

  console.group('user id\n', req.user, '\n', posts);

  res.json(posts);
});

export default router;
