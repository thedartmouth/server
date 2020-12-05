import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import morgan from 'morgan'

import {
	articleRouter,
	authRouter,
	userRouter,
	feedRouter,
	pollRouter,
	authorRouter,
	tagRouter,
} from './routers'

dotenv.config()

// initialize
const app = express()

// enable CORS
app.use(cors())

// configure logging
app.use(morgan('dev'))

// configure data type
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// declare routers
app.use('/auth', authRouter)
app.use('/users', userRouter)
app.use('/articles', articleRouter)
app.use('/polls', pollRouter)
app.use('/feed', feedRouter)
app.use('/author', authorRouter)
app.use('/tags', tagRouter)

// default index route
app.get('/', (req, res) => {
	res.send('Welcome to hihihih!')
})

// custom 404 middleware
app.use((req, res) => {
	res.status(404).json({
		message: "The route you've requested doesn't exist",
	})
})

// start the server
app.listen(process.env.PORT)

console.log(`listening on: ${process.env.PORT}`)
