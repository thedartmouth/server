import express from 'express';
import { Polls } from '../models';
import { articleController, pollController } from '../controllers';
import { requireAuth } from '../authentication';

const pollRouter = express();

pollRouter.route('/')

  // fetch all polls
  .get((req, res) => {
    pollController.fetchPolls().then((polls) => {
      res.send(polls);
    });
  })

  // create poll
  .post(requireAuth, async (req, res) => {
    res.send(await pollController.createPoll(req.body.question, req.body.answers, req.body.associatedArticle));
  })

  // vote in poll; will display poll afterwards
  .put(requireAuth, async (req, res) => {
    res.send(await pollController.answerPoll(req.body.pollID, req.body.userID, req.body.answerChoice));
  })

  .delete(requireAuth, (req, res) => {

  });

pollRouter.route('/fetchAnswered')

  // fetch all answered polls for user
  .get(requireAuth, (req, res) => {
    pollController.fetchAnsweredPolls(req.body.userID).then((polls) => {
      res.send(polls);
    });
  });

pollRouter.route('/fetchUnanswered')

// fetch all unanswered polls for user
  .get(requireAuth, (req, res) => {
    pollController.fetchUnansweredPolls(req.body.userID).then((polls) => {
      res.send(polls);
    });
  });


pollRouter.route('/:id')

  .get(requireAuth, async (req, res) => {
    res.send(await Polls.findById(req.params.id).populate('associatedArticle'));
  })

  .delete(requireAuth, (req, res) => {

  });

export default pollRouter;
