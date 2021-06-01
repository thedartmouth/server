import express from 'express'
import asyncHandler from 'express-async-handler'
import { ceoController } from '../controllers'

const ceoRouter = express()

ceoRouter.route('/connector').post(
	asyncHandler(async (req, res) => {
		if (process.env.CEO_CONNECTOR_ENABLED === 'true')
			ceoController.handleData(req.body)
		res.sendStatus(200)
	})
)

export default ceoRouter
