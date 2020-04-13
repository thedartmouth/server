import express from 'express';

// TODO: Remove axios
import axios from 'axios';

const router = express();

router.route('/')
  .get((req, res) => {
    // Test link: http://localhost:9090/search?query=22&page=1
    console.log('Params:', req.query);

    // Get test JSON from jsonplaceholder and send to frontend for display
    axios.get('https://jsonplaceholder.typicode.com/posts').then((response) => {
      res.send(response.data);
    }).catch((error) => {
      res.json(error);
    });
  });

export default router;
