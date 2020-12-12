import app from '../app'
import request from 'supertest'
import * as uuid from 'uuid'

import { userController } from '../controllers'
import { generateToken } from '../modules/auth'

export default () =>
	describe('The authentication middleware', () => {
		let user

		beforeAll(async (done) => {
			user = {
				email: `${uuid.v4()}@gmail.com`,
				password: 'good_password',
			}

			user.id = await userController.createUser(user)
			user.token = generateToken(user.id)

			done()
		})

		describe('for {requireToken}', () => {
			test('prohibits access without token', async () => {
				expect.assertions(1)
				const res = await request(app).get('/require-auth')
				expect(res.statusCode).toBe(401)
			})
			test('permits access with token', async () => {
				expect.assertions(1)
				const res = await request(app)
					.get('/require-auth')
					.auth(user.token, { type: 'bearer' })
				expect(res.statusCode).toBe(200)
			})
			test('permits access as admin', async () => {
				expect.assertions(1)
				const res = await request(app)
					.get('/require-auth')
					.set('API_KEY', process.env.API_KEY)
				expect(res.statusCode).toBe(200)
			})
		})

		describe('for {requireToken} with {admin}', () => {
			test('prohibits non-admin access without token', async () => {
				expect.assertions(1)
				const res = await request(app).get('/require-auth-admin/')
				expect(res.statusCode).toBe(401)
			})
			test('prohibits non-admin access with token', async () => {
				expect.assertions(1)
				const res = await request(app)
					.get('/require-auth-admin/')
					.auth(user.token, { type: 'bearer' })
				expect(res.statusCode).toBe(401)
			})
			test('permits access as admin', async () => {
				expect.assertions(1)
				const res = await request(app)
					.get('/require-auth-admin/')
					.auth(user.token, { type: 'bearer' })
					.set('API_KEY', process.env.API_KEY)
				expect(res.statusCode).toBe(200)
			})
		})

		describe('for {requireSelf}', () => {
			test('prohibits access without token matching self', async () => {
				expect.assertions(1)
				const res = await request(app).get(
					`/require-auth-self/${uuid.v4()}`
				)
				expect(res.statusCode).toBe(401)
			})
			test('permits access with token matching self', async () => {
				expect.assertions(1)
				const res = await request(app)
					.get(`/require-auth-self/${user.id}`)
					.auth(user.token, { type: 'bearer' })
				expect(res.statusCode).toBe(200)
			})
			test('permits access access as admin', async () => {
				expect.assertions(1)
				const res = await request(app)
					.get(`/require-auth-self/${uuid.v4()}`)
					.set('API_KEY', process.env.API_KEY)
				expect(res.statusCode).toBe(200)
			})
		})
	})
