import express from 'express';
import { tagController } from '../controllers';
import { requireAuth } from '../authentication';

const tagRouter = express();

/*
 * PUT /tags/:userID/:tagID"
 * Allows  the user to follow or unfollow an article tag
 * returns an array of JSON API updated
 */
tagRouter.route(requireAuth, '/:userID/:tagID')
  .put(async (req, res) => {
    res.send(
      await tagController.tagArticle(req.params.userID, req.params.tagID),
    );
  });


export default tagRouter;
