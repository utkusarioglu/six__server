import express from 'express';

const router = express.Router();

router.get('/headers', (req, res) => {
  res.json({ route: 'headers', headers: req.headers });
});

export default router;
