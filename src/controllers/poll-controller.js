import { Polls } from '../models';

async function fetchPolls() {
  Polls.find({}).then((foundResult) => {
    return foundResult;
  });
}

async function fetchUnansweredPolls(userID) {
  const UnansweredPolls = [];
  Polls.find({}).then((foundResult) => {
    // used for each loop to iterate through polls
    for (const poll of foundResult) {
      if (poll.usersVoted.includes(userID) === true) {
        UnansweredPolls.push(poll);
      }
    }
  });
  return UnansweredPolls;
}

async function fetchAnsweredPolls(userID) {
  const AnsweredPolls = [];
  Polls.find({}).then((foundResult) => {
    // used for each loop to iterate through polls
    for (const poll of foundResult) {
      if (poll.usersVoted.includes(userID) === false) {
        AnsweredPolls.push(poll);
      }
    }
  });
  return AnsweredPolls;
}

// Assumes answers passed in as list
function createPoll(question, answerChoices, articleID) {
  const voteMap = new Map(answerChoices.map((answer) => { return [answer, 0]; })); // this currently returns an array
  const thisPoll = new Polls();
  thisPoll.answers = voteMap;
  thisPoll.question = question;
  thisPoll.save().then((savedPoll) => {
    return savedPoll;
  });
}


// lets user answer poll
function answerPoll(pollID, userID, answerChoice) {
  Polls.findById(pollID).then((foundPoll) => {
    if (foundPoll.usersVoted.includes(userID)) { // already in users voted list
      throw new Error('Already Voted');
    } else {
      foundPoll.answers.set(answerChoice, answers.get(answerChoice) + 1); // Increments vote by 1
      foundPoll.usersVoted.push(userID); // Prevents double voting
      foundPoll.save().then((savedPoll) => {
        return savedPoll;
      });
    }
  });
}

export default {
  fetchPolls, answerPoll, createPoll, fetchUnansweredPolls, fetchAnsweredPolls,
};
