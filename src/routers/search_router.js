import express from 'express';

// TODO: Remove axios
import axios from 'axios';

const router = express();

router.route('/')
  .get((req, res) => {
    // Test link: http://localhost:9090/search?query=22&page=1
    console.log('Params:', req.query);
    const {
      query, filters, sort, page, numPerPage,
    } = req.query;

    // Get test JSON from jsonplaceholder and send to frontend for display
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      const tempArray = (response.data || [])
        // .filter()
        .sort((a, b) => {
          if (a.title < b.title) return (sort === 'a' ? -1 : 1);
          if (a.title > b.title) return (sort === 'a' ? 1 : -1);
          return 0;
        });
        // .slice(10); // numPerPage * page, (numPerPage + 1) * page

      // console.log(tempArray);
      // console.log(tempArray.slice(0, 10));

      res.send(tempArray);
    }).catch((error) => {
      res.json(error);
    });
  });

export default router;
