import express from 'express';
import { articleController } from '../controllers';
import { requireAuth } from '../authentication';

const articleRouter = express();

// find and return all resources
articleRouter.route('/')
  .get(async (req, res) => {
    // articleController.fetchArticles().then((articles) => {
    //   res.send(articles);
    // });
    res.send(await articleController.fetchArticles());
  })

  .post(requireAuth, async (req, res) => {
    // what's the context on what this should explicitly return,
    // and what the data type of ceoarticle is? (and if it comes in the body)
    // or should this be in /:id actually?
    res.send(await articleController.createArticle(req.body));
  });

articleRouter.route('/:uuid')

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
    res.send(await articleController.incrementViewCount(req.params.id));
    // or perhaps bookmarking goes here?
  });

articleRouter.route('/:userID/:articleID')
  .put(async (req, res) => {
    res.send(await articleController.bookmarkArticle(req.params.userID, req.params.articleID));
  });

export default articleRouter;
