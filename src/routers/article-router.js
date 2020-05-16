import express from 'express';
import { articleController } from '../controllers';
import { requireAuth } from '../authentication';

const articleRouter = express();

// find and return all resources
articleRouter.route('/')

  // Get all resources
  .get((req, res) => {
    articleController.fetchArticles().then((articles) => {
      res.send(articles);
    });
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

export default articleRouter;
