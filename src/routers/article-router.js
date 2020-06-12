import express from 'express';
import { articleController, pollController } from '../controllers';
// import { pollController} from '../controllers';
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
  .post(async (req, res) => {
    await pollController.createPoll(req.body.question, req.body.answers, req.body.ArticleId) 
      res.send("success"); 
  }) 

  // Delete all resources (SECURE, TESTING ONLY)
  .delete(requireAuth, (req, res) => {

  });

articleRouter.route('/:id')

  // Get resource by id
  .get((req, res) => {

  })

  // Update resource by id (SECURE)
  .put(async (req, res) => {
    await pollController.answerPoll(req.body.articleID, req.body.userID, req.body.answerChoice) 
      res.send("success"); 
  })

  // Delete resource by id, SECURE
  .delete(requireAuth, (req, res) => {

  });

export default articleRouter;
