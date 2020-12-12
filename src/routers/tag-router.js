import express from 'express'
import { tagController } from '../controllers'
import { requireToken } from '../modules/auth'

const tagRouter = express()

/*
 * PUT /tags/:userID/:tagID"
 * Allows user to follow or unfollow an article tag
 * returns updated user and tag
 */
tagRouter.route('/:userID/:tagID').put(requireToken, async (req, res) => {
	res.send(await tagController.tagArticle(req.params.userID, req.params.tagID))
})

export default tagRouter
