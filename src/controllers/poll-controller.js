import { Polls } from '../models';

async function fetchPolls() {
  // const results = await Polls.find({});
  // await console.log(results);
  Polls.find({}).then((foundResult) => {
    return foundResult;
  });
}

// Assumes answers passed in as list
function createPoll(question, answerChoices, articleID) {
  const voteMap = new Map(answerChoices.map((answer) => { return [answer, 0]; })); // this currently returns an array
  const thisPoll = new Polls();
  thisPoll.answers = voteMap;
  thisPoll.question = question;
  // thisPoll.Id = articleID;

  thisPoll.save().then((savedPoll) => {
    return savedPoll;
  });
}


// lets user answer poll
function answerPoll(articleID, userID, answerChoice) {
  Polls.findById(articleID).then((foundPoll) => {
    if (foundPoll.usersVoted.indexOf(userID) > -1) { // already in users voted list
      console.log('Already Voted');
    } else {
      foundPoll.answers.set(answerChoice, answers.get(answerChoice) + 1); // Increments vote by 1
      foundPoll.usersVoted.push(userID); // Prevents double voting
      foundPoll.save().then((savedPoll) => {
        return savedPoll;
      });
    }
  });
}

export default { fetchPolls, answerPoll, createPoll };
