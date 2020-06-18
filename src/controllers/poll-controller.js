import { Polls } from '../models';

async function fetchPolls() {
  Polls.find({}).then((foundResult) => {
    return foundResult;
  });
}

async function fetchUnansweredPolls(userID) {
  UnansweredPolls = []
  for (let poll of fetchPolls()) {
      if (poll.usersVoted.includes(userID) == false){
        UnansweredPolls.push(poll); 
      }
  }
  return UnansweredPolls;
}

async function fetchAnsweredPolls(userID) {
  AnsweredPolls = []
  for (let poll of fetchPolls()) {
      if (poll.usersVoted.includes(userID) == true){
        AnsweredPolls.push(poll); 
      }
  }
  return AnsweredPolls;
  // AnsweredPolls = []; 
  // Polls.find({}).then((foundResult) => {
  //   // used for each loop to iterate through polls 
  //   for await(poll of foundResult) {
  //     if (poll.usersVoted.includes(userID) == true){
  //       AnsweredPolls.push(poll); 
  //     }
  //   }
  // });
  return AnsweredPolls;
}

// Assumes answers passed in as list
function createPoll(question, answerChoices, associatedArticle) {
  const voteMap = new Map(answerChoices.map((answer) => { return [answer, 0]; })); // this currently returns an array
  const thisPoll = new Polls();
  thisPoll.answers = voteMap;
  thisPoll.question = question;
  thisPoll.associatedArticle = associatedArticle;

  return thisPoll.save();
}


// lets user answer poll
function answerPoll(pollID, userID, answerChoice) {
  Polls.findById(pollID).then((foundPoll) => {
    if (foundPoll.usersVoted.includes(userID)) { // already in users voted list
      return; 
    } else {
      foundPoll.answers.set(answerChoice, foundPoll.answers.get(answerChoice) + 1); // Increments vote by 1
      foundPoll.usersVoted.add(userID); // Prevents double voting
      foundPoll.save().then((savedPoll) => {
        return savedPoll;
      });
    }
  });
}

export default { fetchPolls, answerPoll, createPoll, fetchUnansweredPolls, fetchAnsweredPolls};
