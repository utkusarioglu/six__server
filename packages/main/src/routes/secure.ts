import express from 'express';

const router = express.Router();

router.get('/user', (_req, res) => {
  res.json({ route: 'user', isSecure: true });
});

export default router;
