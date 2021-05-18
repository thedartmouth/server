import express from 'express'
import asyncHandler from 'express-async-handler'
import { requireToken } from '../modules/auth'
import { notificationController } from '../controllers'

const notificationRouter = express()

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

notificationRouter.route('/direct').post(
	requireToken({}),
	asyncHandler(async (req, res) => {
		await notificationController.postDirect(req.body)
		res.sendStatus(201)
	})
)

notificationRouter
	.route('/pool')
	.get(
		requireToken({}),
		asyncHandler(async (_, res) => {
			res.json(await notificationController.getPool())
		})
	)
	.post(
		requireToken({}),
		asyncHandler(async (req, res) => {
			await notificationController.postDirect(req.body.type)
			res.sendStatus(201)
		})
	)

export default notificationRouter
