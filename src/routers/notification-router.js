import express from 'express'
import asyncHandler from 'express-async-handler'
import { requireToken } from '../modules/auth'
import { notificationController } from '../controllers'
import { Notification } from '../modules/notifications'

const notificationRouter = express()

notificationRouter.route('/:notificationId').get(
	asyncHandler(async (req, res) => {
		try {
			res.status(200).json(
				await Notification.fetchById(req.params.notificationId)
			)
		} catch (e) {
			res.status(500).send(e.message)
		}
	})
)

notificationRouter.route('/tokens').post(
	asyncHandler(async (req, res) => {
		const status = await notificationController.checkToken(
			req.body.token,
			req.body.userId
		)
		res.sendStatus(status)
	})
)

notificationRouter
	.route('/settings')
	.get(
		asyncHandler(async (req, res) => {
			const { token } = req.query
			res.json(await notificationController.getSettings(token))
		})
	)
	.put(
		asyncHandler(async (req, res) => {
			const { token } = req.query
			res.json(await notificationController.updateSettings(token, req.body))
		})
	)

notificationRouter.route('/general').post(
	requireToken({}),
	asyncHandler(async (req, res) => {
		try {
			await notificationController.postGeneralNotification(
				req.body.title,
				req.body.body
			)
			res.sendStatus(201)
		} catch (e) {
			res.status(500).send(e.message)
		}
	})
)

notificationRouter.route('/article').post(
	requireToken({}),
	asyncHandler(async (req, res) => {
		try {
			const result = await notificationController.postArticleNotification(
				req.body.articleSlug
			)
			res.status(201).json(result)
		} catch (e) {
			res.status(500).send(e.message)
		}
	})
)

export default notificationRouter
