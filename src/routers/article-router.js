import express from 'express';
import { articleController } from '../controllers';
import { requireAuth } from '../authentication';

const articleRouter = express();

// find and return all resources
articleRouter.route('/')

  // Get all resources
  .get(async (req, res) => {
    // articleController.fetchArticles().then((articles) => {
    //   res.send(articles);
    // });
    res.send(await articleController.fetchArticles());
  })

  // Create new resource (SECURE)
  .post(requireAuth, (req, res) => {

  })

  // Delete all resources (SECURE, TESTING ONLY)
  .delete(requireAuth, (req, res) => {

  });

articleRouter.route('/:id')

  // Get resource by id
  .get((req, res) => {

  })

  // Update resource by id (SECURE)
  .put(requireAuth, (req, res) => {

  })

  // Delete resource by id, SECURE
  .delete(requireAuth, (req, res) => {

  });

articleRouter.route('/:userID', '/:articleId')
  .put(async (req, res) => {
    res.send(await articleController.bookmarkArticle(req.params.userID, req.params.articleID));
  });

export default articleRouter;
