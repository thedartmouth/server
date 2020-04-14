import express from 'express';

// TODO: Remove axios
import axios from 'axios';

const router = express();

router.route('/')
  .get((req, res) => {
    // Test link: http://localhost:9090/search?query=22&page=1
    console.log('Params:', req.query);
    const {
      query, filters, sort,
    } = req.query;

    const page = parseInt(req.query.page, 10);
    const numPerPage = parseInt(req.query.numperpage, 10);

    // Get test JSON from jsonplaceholder and send to frontend for display
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      const tempArray = (response.data || []).slice()
        // .filter()
        .sort((a, b) => {
          if (a.title < b.title) return (sort === 'a' ? -1 : 1);
          if (a.title > b.title) return (sort === 'a' ? 1 : -1);
          return 0;
        })
        .filter((e, i) => { return numPerPage * (page - 1) <= i && i < numPerPage * page; }); // numPerPage * page, (numPerPage + 1) * page

      console.log('Results length:', tempArray.length);

      res.send(tempArray);
    }).catch((error) => {
      res.json(error);
    });
  });

export default router;
