import { Polls } from '../models';

async function fetchPolls() {
  return Polls.find({});
}

async function fetchAnsweredPolls(userID) {
  const AnsweredPolls = new Array(); 
  let allPolls = new Array(); 
  allPolls = await Polls.find({});
  for (var i = 0; i < allPolls.length; i++) {
      if (allPolls[i].usersVoted.some(id => (id).equals(userID))){
        AnsweredPolls.push(allPolls[i]); 
      }
  }
  return AnsweredPolls;
}

async function fetchUnansweredPolls(userID) {
  const UnansweredPolls = new Array(); 
  let allPolls = new Array(); 
  allPolls = await Polls.find({});
  for (var i = 0; i < allPolls.length; i++) {
      console.log(allPolls[i].usersVoted[1]);
      console.log(userID);
      if (!allPolls[i].usersVoted.some(id => (id).equals(userID))){
        UnansweredPolls.push(allPolls[i]); 
      }
  }
  return UnansweredPolls;
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
    if (foundPoll.usersVoted.some(id => id.equals(userID))) { // already in users voted list
      console.log("already voted");
      var voteSuccess = new Boolean(false);
      return voteSuccess;
    } 
    else {
      foundPoll.answers.set(answerChoice, foundPoll.answers.get(answerChoice) + 1); // Increments vote by 1
      foundPoll.usersVoted.push(userID); // Prevents double voting
      foundPoll.save().then((savedPoll => {}));
      console.log("voting");
      var voteSuccess = new Boolean(true);
      return voteSuccess;
    }
  });
}

export default { fetchPolls, answerPoll, createPoll, fetchUnansweredPolls, fetchAnsweredPolls};
