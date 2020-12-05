import express from 'express'
import { articleController, userController } from '../controllers'

const articleRouter = express()

articleRouter.route('/:slug').get(async (req, res) => {
	try {
		res.json(await articleController.fetchMetaArticle(req.params.slug))
	} catch (err) {
		console.log(err)
		res.status(500).send(err.message)
	}
})

articleRouter
	.route('/read/:slug')
	.post(
		(req, res, next) =>
			userController.validateUserExistence(req, res, next, req.body.userId),
		async (req, res) => {
			if (!req.params.slug) {
				res.status(400).send('missing article slug')
			} else {
				try {
					res.json(
						await articleController.readArticle(
							req.params.slug,
							req.body.userId
						)
					)
				} catch (err) {
					res.status(500).send(err.message)
				}
			}
		}
	)

articleRouter
	.route('/share')
	.post(async (req, res) => {
		if (!req.body || !req.body.article) {
			res.status(400).send('missing body or article')
			return
		}
		try {
			res.json(
				await articleController.shareArticle(req.body.article, req.user)
			)
		} catch (error) {
			console.log(error)
			res.status(500).send('error processing shared article')
		}
	})

articleRouter.route('/').post(async (req, res) => {
	if (!req.body.slug || typeof req.body.slug != 'string') {
		res.status(400).send('missing or bad slug')
	} else {
		try {
			res.json(await articleController.createMetaArticle(req.body.slug))
		} catch (err) {
			res.status(500).send(err.message)
		}
	}
})

articleRouter
	.route('/bookmark/:slug')
	.post(userController.validateUserExistence, async (req, res) => {
		try {
			res.json(
				await articleController.bookmarkArticle(
					req.params.slug,
					req.body.userId
				)
			)
		} catch (err) {
			res.status(500).send(err.message)
		}
	})

export default articleRouter
