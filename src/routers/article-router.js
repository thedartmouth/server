import express from 'express'
import asyncHandler from 'express-async-handler'
import { requireToken, requireSelf } from '../modules/auth'
import { articleController, userController } from '../controllers'

const articleRouter = express()

articleRouter.route('/:slug').get(
	asyncHandler(async (req, res) => {
		res.json(await articleController.fetchMetaArticle(req.params.slug))
	})
)

articleRouter.route('/read/:articleSlug').post(
	asyncHandler(async (req, res) => {
		if (!req.params.articleSlug) {
			res.status(400).send('missing {articleSlug}')
		} else {
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
		}
	})
)

articleRouter.route('/share').post(
	asyncHandler(async (req, res) => {
		if (!req.body?.article) {
			res.status(400).send('missing article data')
			return
		}
		res.json(await articleController.shareArticle(req.body.article, req.user))
	})
)

articleRouter.route('/').post(
	asyncHandler(async (req, res) => {
		if (!req.body?.slug) {
			res.status(400).send('missing or bad slug')
		} else {
			res.json(await articleController.createMetaArticle(req.body.slug))
		}
	})
)

articleRouter
	.route('/bookmarks')
	.get(
		requireToken(),
		asyncHandler(async (req, res) => {
			await userController.validateUserExistence(req.params.userId)(
				req.body.userId
			)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(await userController.getBookmarkedArticles(req.body.userId))
		})
	)
	.post(
		asyncHandler(async (req, res) => {
			if (!req.body?.articleSlug) {
				res.status(400).send('missing {articleSlug}')
				return
			}
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
		})
	)

export default articleRouter
