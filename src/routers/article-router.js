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
   *  increment total view count,
   *  increment specific user view count (with optional login)
   *
   * response: updated article object
   */
  .post(optionalAuth, async (req, res) => {
    if (!req.body || !req.body.article) {
      res.status(400).send('missing body or article');
      return;
    }
    try {
      res.json(await articleController.processReadArticle(req.body.article, req.user));
    } catch (error) {
      console.log(error);
      res.status(500).send('error processing read article');
    }
  });

// find and return all resources
articleRouter.route('/')

  .get(async (req, res) => {
    res.send(await articleController.fetchArticles());
  })

  .post(requireAuth, async (req, res) => {
    // what's the context on what this should explicitly return,
    // and what the data type of ceoarticle is? (and if it comes in the body)
    // or should this be in /:id actually?
    res.send(await articleController.createArticle(req.body.article));
  });

articleRouter.route('/:slug')

  .get((req, res) => {
    // what exactly happens here? the client won't be getting text content from us
    // guessing we're throwing a GET at the json API and checking the CEOID against our index
    // of CEOIDs in article-model and creating a new document if needed,
    // and then just forwarding the response to the client
    // also see @PUT below: does the view count get updated here or there?
  })

  .put(requireAuth, async (req, res) => {
    // only context I forsee this being used is updating the view count,
    // let me know if there are more functionalities in PUT later on
    // also unsure of the data format in req.body
    res.send(await articleController.incrementViewCount(req.params.slug));
    // or perhaps bookmarking goes here?
  });

export default articleRouter;
