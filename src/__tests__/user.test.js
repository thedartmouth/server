import app from '../app'
import request from 'supertest'
import * as uuid from 'uuid'

const path = '/users'

export default () =>
	describe('The user endpoint', () => {
		const user = {
			firstName: `Test`,
			lastName: 'User',
			email: `${uuid.v4()}@email.com`,
			password: 'good_password',
		}

		describe('successfully', () => {
			test('creates a new user', async () => {
				expect.assertions(4)

				const createRes = await request(app)
					.post(path)
					.send(user)
					.set('Accept', 'application/json')
				expect(createRes.statusCode).toBe(200)
				expect(uuid.validate(createRes.body.userId)).toBe(true)
				console.info(`Newly created userId ${createRes.body.userId}`)
				user.id = createRes.body.userId

				const getRes = await request(app)
					.get(`${path}/${createRes.body.userId}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getRes.statusCode).toBe(200)
				expect(getRes.body).toEqual({
					name: {
						first: user.firstName,
						last: user.lastName,
					},
					email: user.email,
					reads: 0,
				})
				console.table(getRes.body)
			})
		})

		describe('successfully', () => {
			test('authenticates with email and password', async () => {
				expect.assertions(3)

				const getRes = await request(app)
					.post(`${path}/auth`)
					.send({
						email: user.email,
						password: user.password,
					})
					.set('Accept', 'application/json')
				expect(getRes.statusCode).toBe(200)
				expect(getRes.body).toHaveProperty('token')
				expect(getRes.body?.userId).toBe(user.id)
				user.token = getRes.body.token
			})

			test('prohibits access for valid email but invalid password', async () => {
				expect.assertions(2)

				const getRes = await request(app)
					.post(`${path}/auth`)
					.send({
						email: user.email,
						password: uuid.v4(),
					})
					.set('Accept', 'application/json')
				expect(getRes.statusCode).toBe(401)
				expect(getRes.text).toBe('invalid credentials')
			})

			test('prohibits access for invalid email but valid password', async () => {
				expect.assertions(2)

				const getRes = await request(app)
					.post(`${path}/auth`)
					.send({
						email: uuid.v4(),
						password: user.password,
					})
					.set('Accept', 'application/json')
				expect(getRes.statusCode).toBe(401)
				expect(getRes.text).toBe('invalid credentials')
			})
		})

		describe('successfully', () => {
			test('prohibits user deletion without authentication by user', async () => {
				expect.assertions(1)

				const getRes = await request(app)
					.delete(`${path}/${user.id}`)
					.auth(uuid.v4(), { type: 'bearer' })
				expect(getRes.statusCode).toBe(401)
			})
		})

		describe('successfully', () => {
			test('deletes a user', async () => {
				expect.assertions(1)

				const getRes = await request(app)
					.delete(`${path}/${user.id}`)
					.auth(user.token, { type: 'bearer' })
				expect(getRes.statusCode).toBe(200)
			})
		})
	})
