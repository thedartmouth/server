import express from 'express'
import { feedController } from '../controllers'
import { requireAuth } from '../authentication'

const feedRouter = express()

/*
 * GET /feed/authors
 * grabs a chronological feed of all articles authored by following authors
 *
 * returns an array of JSON API article objects
 * WIP to be paginated/cached later
 */
feedRouter.route('/authors').get(requireAuth, async (req, res) => {
	try {
		res.json(await feedController.fetchFollowingFeed(req.user, 'Authors'))
	} catch (error) {
		console.log(error)
		res.status(500).send('error fetching author feed')
	}
})

// currently untested since tag following isn't implemented yet
// but logic works for authors so should work the same here
feedRouter.route('/tags').get(requireAuth, async (req, res) => {
	try {
		res.json(await feedController.fetchFollowingFeed(req.user, 'Tags'))
	} catch (error) {
		console.log(error)
		res.status(500).send('error fetching tags feed')
	}
})

export default feedRouter
