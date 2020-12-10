import express from 'express'
import { requireAuth, requireSelf } from '../authentication'
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

articleRouter.route('/read/:articleSlug').post(async (req, res) => {
	if (!req.params.articleSlug) {
		res.status(400).send('missing {articleSlug}')
	} else {
		try {
			await userController.validateUserExistence(req.params.userId)(
				req.body.userId
			)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(
				await articleController.readArticle(
					req.params.articleSlug,
					req.body.userId
				)
			)
		} catch (err) {
			res.status(500).send(err.message)
		}
	}
})

articleRouter.route('/share').post(async (req, res) => {
	if (!req.body?.article) {
		res.status(400).send('missing article data')
		return
	}
	try {
		res.json(await articleController.shareArticle(req.body.article, req.user))
	} catch (error) {
		console.log(error)
		res.status(500).send('error processing shared article')
	}
})

articleRouter.route('/').post(async (req, res) => {
	if (!req.body?.slug) {
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
	.route('/bookmarks')
	.get(requireAuth(), async (req, res) => {
		try {
			await userController.validateUserExistence(req.params.userId)(
				req.body.userId
			)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(await userController.getBookmarkedArticles(req.body.userId))
		} catch (err) {
			res.status(500).send(err.message)
		}
	})
	.post(async (req, res) => {
		if (!req.body?.articleSlug) {
			res.status(400).send('missing {articleSlug}')
			return
		}
		try {
			await userController.validateUserExistence(req.params.userId)(
				req.body.userId
			)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(
				await articleController.bookmarkArticle(
					req.body.articleSlug,
					req.body.userId
				)
			)
		} catch (err) {
			res.status(500).send(err.message)
		}
	})

export default articleRouter
