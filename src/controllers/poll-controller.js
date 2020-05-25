import { Polls } from '../models';

async function fetchPolls() {
  const results = await Polls.find({});
  await console.log(results);
}

function createPoll(poll) {

}

function answerPoll(articleID, userID) {
  // note that the user completed this in the user model
}

export { fetchPolls, answerPoll };
