import express from 'express';
import { articleController } from '../controllers';
import { requireAuth, optionalAuth } from '../authentication';

const articleRouter = express();

articleRouter.route('/read')
  /*
   * POST /articles/read
   * all-purpose route for processing a read article by the client
   *
   * request: article JSON object with slug and uuid
   * logic: adds the article to DB if not already there
   *  adds the user id to the viewedUsers array if not already there
   *
   * response: updated article object
   */
  .post(async (req, res) => {
    if (!req.body.slug || !req.body.userId) {
      res.status(400).send('missing article slug or userId');
    } else {
      try {
        res.json(await articleController.readArticle(req.body.slug, req.body.userId));
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  });

articleRouter.route('/share')
  /*
   * POST /articles/share
   * adds to the share counter of an article, assumes it's already read
   *
   * request: article JSON object with slug and uuid
   *  adds the user id to the sharedUsers array if not already there
   *
   * response: updated article object
   */
  .post(optionalAuth, async (req, res) => {
    if (!req.body || !req.body.article) {
      res.status(400).send('missing body or article');
      return;
    }
    try {
      res.json(await articleController.shareArticle(req.body.article, req.user));
    } catch (error) {
      console.log(error);
      res.status(500).send('error processing shared article');
    }
  });


articleRouter.route('/')
  .post(async (req, res) => {
    if (!req.body.slug || typeof req.body.slug != 'string') {
      res.status(400).send('missing or bad slug');
    } else {
      try {
        res.send(await articleController.createMetaArticle(req.body.slug));
      } catch (err) {
        res.status(500).send(err.message);
      }
    }
  });

articleRouter.route('/:slug')
  .get(async (req, res) => {
    try {
      res.send(await articleController.fetchMetaArticle(req.params.slug));
    } catch (err) {
      console.log(err);
      res.status(500).send(err.message);
    }
  })

  .put(requireAuth, async (req, res) => {
    // only context I forsee this being used is updating the view count,
    // let me know if there are more functionalities in PUT later on
    // also unsure of the data format in req.body
    res.send(await articleController.incrementViewCount(req.params.slug));
    // or perhaps bookmarking goes here?
  });

articleRouter.route('/:userID/:articleID')
  .put(async (req, res) => {
    res.send(await articleController.bookmarkArticle(req.params.userID, req.params.articleID));
  });

export default articleRouter;
