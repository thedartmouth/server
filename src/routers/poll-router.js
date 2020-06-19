import express from 'express';
import { Polls } from '../models';
import { articleController, pollController } from '../controllers';
import { requireAuth } from '../authentication';

const pollRouter = express();

pollRouter.route('/')

  .get((req, res) => {
    pollController.fetchPolls().then((polls) => {
      res.send(polls);
    });
  })

  .post(requireAuth, async (req, res) => {
    res.send(await pollController.createPoll(req.body.question, req.body.answers, req.body.associatedArticle));
  })

  .put(requireAuth, async (req, res) => {
    // Controller will send error if user has already voted in poll 
    res.send(await pollController.answerPoll(req.body.pollID, req.body.userID, req.body.answerChoice));
    // var voteSuccess = new Boolean(await pollController.answerPoll(req.body.pollID, req.body.userID, req.body.answerChoice)); 
    // if (voteSuccess == true) {
    //     console.log("after")
    //     res.send('Successfully Voted');
    // }
    // else {
    //     console.log("after2")
    //     res.send('Already Voted');
    // }
    // console.log(voteSuccess);
    })
    // try {
    //   await pollController.answerPoll(req.body.pollID, req.body.userID, req.body.answerChoice);
    //   res.send('success');
    // } catch (error) {
    //   res.send('Already voted');
    // }

  .delete(requireAuth, (req, res) => {

  });

pollRouter.route('/fetchAnswered')

  .get(requireAuth, (req, res) => {
    pollController.fetchAnsweredPolls(req.body.userID).then((polls) => {
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
