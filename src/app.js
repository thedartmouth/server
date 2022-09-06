import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import { errorHandlerMiddleware } from './modules/error'
import { requireToken, requireSelf } from './modules/auth'
import {
	articleRouter,
	userRouter,
	feedRouter,
	notificationRouter,
	ceoRouter,
} from './routers'

dotenv.config()

// initialize
const app = express()

// enable CORS
app.use(cors())

// configure logging
app.use(morgan('prod'))

// configure data type
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// declare routers
app.use('/users', userRouter)
app.use('/articles', articleRouter)
app.use('/feed', feedRouter)
app.use('/notifications', notificationRouter)
app.use('/ceo', ceoRouter)

// default index route
app.get('/', (req, res) => {
	res.send('Welcome!')
})

app.get('/require-auth', requireToken({}), (req, res) => {
	res.sendStatus(200)
})
app.get('/require-auth-self/:userId', requireToken({}), (req, res) => {
	requireSelf(req.params.userId, req)(res)
	res.sendStatus(200)
})
app.get('/require-auth-admin', requireToken({ admin: true }), (req, res) => {
	res.sendStatus(200)
})

// custom 404 middleware
app.use((req, res) => {
	res.status(404).json({
		message: "The route you've requested doesn't exist",
	})
})

app.use(errorHandlerMiddleware)

export default app
