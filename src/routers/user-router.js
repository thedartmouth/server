import express from 'express'
import { UserValidationError } from '../modules/error'
import { requireAuth, requireSelf } from '../authentication'
import { userController } from '../controllers'

const userRouter = express()

userRouter.route('/').post(async (req, res) => {
	try {
		res.json({ userId: await userController.createUser(req.body) })
	} catch (err) {
		res.status(500).send(err.message)
	}
})

userRouter.route('/auth').post(async (req, res) => {
	if (!req.body?.email || !req.body?.password) {
		res.status(400).send('bad {email} and {password} format')
		return
	}
	try {
		res.json(
			await userController.generateToken(req.body.email, req.body.password)
		)
	} catch (err) {
		if (err.message === 'invalid credentials')
			res.status(401).send(err.message)
		else res.status(500).send(err.message)
	}
})

userRouter
	.route('/:userId')
	.get(async (req, res) => {
		try {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(await userController.getBasicUserData(req.params.userId))
		} catch (err) {
			res.status(500).json(err)
		}
	})
	.put(requireAuth({}), async (req, res) => {
		try {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.body.userId, req)(res)
			res.json(
				await userController.updateBasicUserData(
					req.params.userId,
					req.body
				)
			)
		} catch (err) {
			res.status(500).send(err.message)
		}
	})
	.delete(requireAuth({}), async (req, res) => {
		try {
			await userController.validateUserExistence(req.params.userId)(res)
			requireSelf(req.body.userId, req)(res)
			await userController.deleteUser(req.params.userId)
			res.sendStatus(200)
		} catch (err) {
			if (!(err instanceof UserValidationError))
				res.status(500).send(err.message)
		}
	})

export default userRouter
