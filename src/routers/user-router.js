import express from 'express'
import asyncHandler from 'express-async-handler'
import { requireToken, requireSelf } from '../modules/auth'
import { userController } from '../controllers'

const userRouter = express()

userRouter.route('/').post(
	asyncHandler(async (req, res) => {
		if (
			req.body.name?.hasOwnProperty('first') &&
			req.body.name?.hasOwnProperty('last') &&
			req.body.hasOwnProperty('email') &&
			req.body.hasOwnProperty('password')
		) {
			res.json(await userController.createUser(req.body))
		} else {
			res.status(400).send('missing user data')
		}
	})
)

userRouter.route('/auth').post(
	asyncHandler(async (req, res) => {
		if (!req.body.email || !req.body.password) {
			res.status(400).send('bad {email} and {password} format')
			return
		}
		res.json(
			await userController.generateTokenForUser(
				req.body.email,
				req.body.password
			)
		)
	})
)

userRouter
	.route('/:userId')
	.get(
		asyncHandler(async (req, res) => {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(await userController.getBasicUserData(req.params.userId))
		})
	)
	.put(
		requireToken({}),
		asyncHandler(async (req, res) => {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(
				await userController.updateBasicUserData(
					req.params.userId,
					req.body
				)
			)
		})
	)
	.delete(
		requireToken({}),
		asyncHandler(async (req, res) => {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.body.userId, req)(res)
			await userController.deleteUser(req.params.userId)
			res.sendStatus(200)
		})
	)

export default userRouter
