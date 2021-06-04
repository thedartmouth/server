import express from 'express'
import asyncHandler from 'express-async-handler'
import extractBearerToken from 'express-bearer-token'
import { ceoController } from '../controllers'

const ceoRouter = express()

ceoRouter.use(extractBearerToken())

ceoRouter.route('/connector').post(
	asyncHandler(async (req, res) => {
		if (process.env.CEO_CONNECTOR_ENABLED === 'true')
			ceoController.handleData(req.token, req.body)
		res.sendStatus(200)
	})
)

export default ceoRouter
