import { Polls } from '../models';

async function fetchPolls() {
  return Polls.find({});
}

async function fetchUnansweredPolls(userID) {
  UnansweredPolls = [];
  allPolls = fetchPolls(); 
  for (let poll of allPolls) {
      if (poll.usersVoted.includes(userID) == false){
        UnansweredPolls.push(poll); 
      }
  }
  return UnansweredPolls;
}

async function fetchAnsweredPolls(userID) {
  const AnsweredPolls = new Array(); 
  let allPolls = new Array(); 
  allPolls = await Polls.find({});
  for (var i = 0; i < allPolls.length; i++) {
      console.log(allPolls[i].usersVoted[1]);
      console.log(userID);
      if (allPolls[i].usersVoted.some(id => (id).equals(userID))){
        AnsweredPolls.push(allPolls[i]); 
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
  // return AnsweredPolls;
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
      return; 
    } else {
      foundPoll.answers.set(answerChoice, foundPoll.answers.get(answerChoice) + 1); // Increments vote by 1
      foundPoll.usersVoted.push(userID); // Prevents double voting
      console.log("BADBAD")
      foundPoll.save().then((savedPoll) => {
        return savedPoll;
      });
    }
  });
}

export default { fetchPolls, answerPoll, createPoll, fetchUnansweredPolls, fetchAnsweredPolls};
