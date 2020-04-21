import express from 'express';

import { search } from '../controllers/search_controller';

const router = express();

router.route('/')
  .get((req, res) => {
    console.log('Params:', req.query);

    const {
      query, filters, sort,
    } = req.query;

    // Parse strings to numbers
    const page = parseInt(req.query.page, 10);
    const numPerPage = parseInt(req.query.numperpage, 10);

    search(query, filters, sort, page, numPerPage).then((results) => {
      res.send({ results, numResults: results.length });
    }).catch((error) => {
      res.json(error);
    });
  });

export default router;
