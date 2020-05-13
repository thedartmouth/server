import express from 'express';

import * as constants from '../constants';

const router = express();

// Return all constants to frontend as JSON
router.get('/', (req, res) => {
  return res.json({ filters: constants.FRONTEND_FILTERS });
});

// Return filters to frontend as JSON
router.get('/filters', (req, res) => {
  return res.json(constants.FRONTEND_FILTERS);
});

export default router;
