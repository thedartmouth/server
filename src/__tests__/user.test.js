import app from '../app'
import request from 'supertest'
import * as uuid from 'uuid'

const path = '/users'

export default () =>
	describe('The user endpoint', () => {
		const user = {
			firstName: 'Test',
			lastName: 'User',
			email: `${uuid.v4()}@email.com`,
			password: 'good_password',
		}

		describe('creates a new user', () => {
			test('successfully', async () => {
				expect.assertions(4)

				const createRes = await request(app)
					.post(path)
					.send(user)
					.set('Accept', 'application/json')
				expect(createRes.statusCode).toBe(200)
				expect(uuid.validate(createRes.body.userId)).toBe(true)
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
			})
		})

		describe('prohibits duplicate emails', () => {
			test('successfully', async () => {
				expect.assertions(1)

				const createRes = await request(app)
					.post(path)
					.send(user)
					.set('Accept', 'application/json')
				expect(createRes.statusCode).toBe(500)
			})
		})

		describe('authenticates with email and password', () => {
			test('successfully', async () => {
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

		describe('updates a user', () => {
			test('successfully', async () => {
				expect.assertions(5)

				const updatedUser = {
					id: 'cannot_set',
					firstName: 'Test_updated',
					lastName: 'User_updated',
					email: `${uuid.v4()}@email.com`,
					password: 'good_password_updated',
				}

				const updateRes = await request(app)
					.put(`${path}/${user.id}`)
					.send(updatedUser)
					.set('Accept', 'application/json')
					.set('API_KEY', process.env.API_KEY)
				expect(updateRes.statusCode).toBe(200)

				const authRes = await request(app)
					.post(`${path}/auth`)
					.send({
						email: updatedUser.email,
						password: updatedUser.password,
					})
					.set('Accept', 'application/json')
				expect(authRes.statusCode).toBe(200)
				expect(authRes.body?.userId).toBe(user.id)

				const getRes = await request(app)
					.get(`${path}/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getRes.statusCode).toBe(200)
				expect(getRes.body).toEqual({
					name: {
						first: updatedUser.firstName,
						last: updatedUser.lastName,
					},
					email: updatedUser.email,
					reads: 0,
				})
			})
		})

		describe('deletes a user', () => {
			test('successfully', async () => {
				expect.assertions(1)

				const getRes = await request(app)
					.delete(`${path}/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getRes.statusCode).toBe(200)
			})
		})
	})
