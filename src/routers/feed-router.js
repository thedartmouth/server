import express from 'express';
import { feedController } from '../controllers';
import { requireAuth } from '../authentication';

const feedRouter = express();

feedRouter.route('/authors')
  // I don't yet know how to test this since I don't know how to add a user
  // for requireAuth
  // but fetchFollowingFeed is 95% tested, only 2 lines untested
  .get(requireAuth, async (req, res) => {
    try {
      res.json(await feedController.fetchFollowingFeed(req.user, 'Authors'));
    } catch (error) {
      res.status(500).send('error fetching author feed');
    }
  });

feedRouter.route('/tags')
  // same comment as above for authorfeed
  .get(requireAuth, async (req, res) => {
    try {
      res.json(await feedController.fetchFollowingFeed(req.user, 'Tags'));
    } catch (error) {
      res.status(500).send('error fetching author feed');
    }
  });

export default feedRouter;
