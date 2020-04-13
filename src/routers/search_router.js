import express from 'express';

const router = express();

router.route('/')
  .get((req, res) => {
    console.log('params:', req.query);
    res.json(req.query);
  });

export default router;
