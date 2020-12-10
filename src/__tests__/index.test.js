import dotenv from 'dotenv'
import app from '../app'
import request from 'supertest'
import userTest from './user.test'

dotenv.config()

describe('The Express app', () => {
	test('starts', async () => {
		expect.assertions(2)
		const res = await request(app).get('/')
		expect(res.statusCode).toBe(200)
		expect(res.text).toBe('Welcome!')
	})
})

userTest()
