/* eslint-disable consistent-return */
import express from 'express'
import { Users } from '../models'
import { requireAuth, requireAdmin } from '../authentication'
import { userController } from '../controllers'

const userRouter = express()

userRouter
	.route('/')
	.post(async (req, res) => {
		try {
			res.json(await userController.createUser(req.body))
		} catch (err) {
			res.status(500).send(err.message)
		}
	})

userRouter
	.route('/:userId')
	.get(
		(req, res, next) => userController.validateUserExistence(req, res, next, req.params.userId),
		async (req, res) => {
			try {
				res.json(await userController.getBasicUserData(req.params.userId))
			} catch (err) {
				res.status(500).send(err.message)
			}
		}
	)
	.put(requireAuth({}), async (req, res) => {
		if (!req.admin && req.user.id !== req.params.userId) {
			res.setStatus(401)
		} else {
			try {
				res.json(await userController.updateBasicUserData(req.params.userId, req.body))
			} catch (err) {
				res.status(500).send(err.message)
			}
		}
	})
	.delete(requireAuth({}), async (req, res) => {
		if (!req.admin && req.user.id !== req.params.userId) {
			res.setStatus(401)
		} else {
			try {
				res.json(await userController.deleteUser(req.params.userId))
			} catch (err) {
				res.status(500).send(err.message)
			}
		}
	})

userRouter
	.route('/bookmarks/:userId')
	.get(
		(req, res, next) => userController.validateUserExistence(req, res, next, req.params.userId),
		async (req, res) => {
			try {
				res.json(
					await userController.getBookmarkedArticles(req.params.userId)
				)
			} catch (err) {
				res.status(500).send(err.message)
			}
		}
	)

export default userRouter
