import express from 'express';

import * as constants from '../constants';

const router = express();

// Return filters to frontend as JSON
router.get('/filters', (req, res) => {
  return res.json(constants.FRONTEND_FILTERS);
});

export default router;
