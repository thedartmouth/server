import express from 'express';
import { Polls } from '../models';
import { articleController, pollController } from '../controllers';
import { requireAuth } from '../authentication';

const pollRouter = express();

pollRouter.route('/')

  .get((req, res) => {
    articleController.fetchArticles().then((articles) => {
      res.send(articles);
    });
  })

  .post(requireAuth, async (req, res) => {
    res.send(await pollController.createPoll(req.body.question, req.body.answers, req.body.associatedArticle));
  })

  .delete(requireAuth, (req, res) => {

  });

pollRouter.route('/:id')

  .get(requireAuth, async (req, res) => {
    res.send(await Polls.findById(req.params.id).populate('associatedArticle'));
  })

  .put(async (req, res) => {
    // Controller will send error if user has already voted in poll
    try {
      await pollController.answerPoll(req.body.pollID, req.body.userID, req.body.answerChoice);
      res.send('success');
    } catch (error) {
      res.send('Already voted');
    }
  })

  .delete(requireAuth, (req, res) => {

  });

export default pollRouter;
