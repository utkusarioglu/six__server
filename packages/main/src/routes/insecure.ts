import express from 'express';

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

export default router;
