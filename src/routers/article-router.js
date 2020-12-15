import express from 'express'
import asyncHandler from 'express-async-handler'
import { requireToken, requireSelf } from '../modules/auth'
import { articleController, userController } from '../controllers'

const articleRouter = express()

articleRouter
	.route('/reads/:userId')
	.get(
		requireToken({}),
		asyncHandler(async (req, res) => {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.params.userId, req)(res)
			res.json(await articleController.getReadArticles(req.params.userId))
		})
	)
	.post(
		requireToken({}),
		asyncHandler(async (req, res) => {
			if (!req.body?.articleSlug) {
				res.status(400).send('missing {articleSlug}')
			} else {
				await userController.validateUserExistence(req.params.userId)(res)
				requireSelf(req.params.userId, req)(res)
				res.json(
					await articleController.readArticle(
						req.body.articleSlug,
						req.params.userId
					)
				)
			}
		})
	)

articleRouter
	.route('/bookmarks/:userId')
	.get(
		requireToken({}),
		asyncHandler(async (req, res) => {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.params.userId, req)(res)
			res.json(
				await articleController.getBookmarkedArticles(req.params.userId)
			)
		})
	)
	.post(
		requireToken({}),
		asyncHandler(async (req, res) => {
			if (!req.body?.articleSlug) {
				res.status(400).send('missing {articleSlug}')
				return
			}
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.params.userId, req)(res)
			res.json(
				await articleController.bookmarkArticle(
					req.body.articleSlug,
					req.params.userId
				)
			)
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

articleRouter.route('/:slug').get(
	requireToken({}),
	asyncHandler(async (req, res) => {
		if (req.query.for) {
			await userController.validateUserExistence(req.query.for)(res)
			requireSelf(req.query.for, req)(res)
		}
		res.json(await articleController.fetchMetaArticle(req.params.slug, req.query.for))
	})
)

export default articleRouter
