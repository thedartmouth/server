import { Polls } from '../models'

// fetch all polls
async function fetchPolls() {
	return Polls.find({})
}

// fetch polls that this user has answered
async function fetchAnsweredPolls(userID) {
	const AnsweredPolls = new Array()
	let allPolls = new Array()
	allPolls = await Polls.find({})
	for (let i = 0; i < allPolls.length; i++) {
		if (
			allPolls[i].usersVoted.some((id) => {
				return id.equals(userID)
			})
		) {
			AnsweredPolls.push(allPolls[i])
		}
	}
	return AnsweredPolls
}

// fetch polls that this user has not answered
async function fetchUnansweredPolls(userID) {
	const UnansweredPolls = new Array()
	let allPolls = new Array()
	allPolls = await Polls.find({})
	for (let i = 0; i < allPolls.length; i++) {
		if (
			!allPolls[i].usersVoted.some((id) => {
				return id.equals(userID)
			})
		) {
			UnansweredPolls.push(allPolls[i])
		}
	}
	return UnansweredPolls
}

// create new poll
function createPoll(question, answerChoices, associatedArticle) {
	const voteMap = new Map(
		answerChoices.map((answer) => {
			return [answer, 0]
		})
	)
	const thisPoll = new Polls()
	thisPoll.answers = voteMap
	thisPoll.question = question
	thisPoll.associatedArticle = associatedArticle
	return thisPoll.save()
}

// user answers poll
async function answerPoll(pollID, userID, answerChoice) {
	return Polls.findById(pollID).then((foundPoll) => {
		if (
			foundPoll.usersVoted.some((id) => {
				return id.toString() == userID
			})
		) {
			// if user has already voted in this poll
			console.log('already voted')
		} else {
			foundPoll.answers.set(
				answerChoice,
				foundPoll.answers.get(answerChoice) + 1
			) // Increments vote by 1
			foundPoll.usersVoted.push(userID) // Prevents double voting
			foundPoll.save()
			console.log('voting')
		}
		return foundPoll
	})
}

export default {
	fetchPolls,
	answerPoll,
	createPoll,
	fetchUnansweredPolls,
	fetchAnsweredPolls,
}
