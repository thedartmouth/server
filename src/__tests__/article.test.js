import app from '../app'
import request from 'supertest'
import * as uuid from 'uuid'

import { generateToken } from '../modules/auth'
import { articleController, userController } from '../controllers'

const path = '/articles'

export default () =>
	describe('The article endpoint', () => {
		let user
		const article = {
			slug: uuid.v4(),
			reads: 0
		}

		beforeAll(async (done) => {
			user = {
				email: `${uuid.v4()}@gmail.com`,
				password: 'good_password',
			}

			user.id = await userController.createUser(user)
			user.token = generateToken(user.id)

			done()
		})

		describe('creates a new article on read', () => {
			test('successfully', async () => {
				expect.assertions(3)

				const readRes = await request(app)
					.post(`${path}/reads/${user.id}`)
					.send({ articleSlug: article.slug })
					.set('API_KEY', process.env.API_KEY)
				expect(readRes.statusCode).toBe(200)

				const getRes = await request(app).get(`${path}/${article.slug}`)
				article.reads += 1
				expect(getRes.statusCode).toBe(200)
				expect(getRes.body).toEqual({
					slug: article.slug,
					reads: article.reads,
				})
			})
		})

		describe('increments read count', () => {
			beforeAll(async (done) => {
				await request(app)
					.post(`${path}/reads/${user.id}`)
					.send({ articleSlug: article.slug })
					.set('API_KEY', process.env.API_KEY)
				done()
			})
			test('successfully', async () => {
				expect.assertions(7)

				const getArticleRes = await request(app).get(
					`${path}/${article.slug}`
				)
				article.reads += 1
				expect(getArticleRes.statusCode).toBe(200)
				expect(getArticleRes.body.reads).toBe(article.reads)

				const getUserRes = await request(app)
					.get(`/users/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getUserRes.statusCode).toBe(200)
				expect(getUserRes.body.reads).toBe(article.reads)

				const getReadsRes = await request(app)
					.get(`${path}/reads/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getReadsRes.statusCode).toBe(200)
				expect(getReadsRes.body.map((article) => article.slug)).toContain(
					article.slug
				)
				expect(getReadsRes.body.map(article => new Date(article.timestamp)).every((date, idx, timestamps) => {
					if (idx < timestamps.length - 1) {
						return date <= new Date(timestamps[idx + 1])
					} else return true
				})).toBe(true)
			})
		})

		describe('bookmarks an article', () => {
			test('successfully', async () => {
				expect.assertions(3)

				await request(app)
					.post(`${path}/bookmarks/${user.id}`)
					.send({ articleSlug: article.slug })
					.set('API_KEY', process.env.API_KEY)

				const getBookmarksRes = await request(app)
					.get(`${path}/bookmarks/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getBookmarksRes.statusCode).toBe(200)
				expect(getBookmarksRes.body.map((article) => article.slug)).toContain(
					article.slug
				)
				expect(getBookmarksRes.body.map(article => new Date(article.timestamp)).every((date, idx, timestamps) => {
					if (idx < timestamps.length - 1) {
						return date <= new Date(timestamps[idx + 1])
					} else return true
				})).toBe(true)
			})
		})

		describe('deletes reads on article deletion', () => {
			test('successfully', async () => {
				expect.assertions(6)
				
				await articleController.deleteMetaArticle(article.slug)

				const getUserRes = await request(app)
					.get(`/users/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getUserRes.statusCode).toBe(200)
				expect(getUserRes.body.reads).toBe(article.reads)

				const getReadsRes = await request(app)
					.get(`${path}/reads/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getReadsRes.statusCode).toBe(200)
				expect(getReadsRes.body.map((article) => article.slug)).toHaveLength(0)
				
				const getBookmarksRes = await request(app)
					.get(`${path}/bookmarks/${user.id}`)
					.set('API_KEY', process.env.API_KEY)
				expect(getBookmarksRes.statusCode).toBe(200)
				expect(getBookmarksRes.body.map((article) => article.slug)).toHaveLength(0)
			})
		})

		afterAll(async (done) => {
			await userController.deleteUser(user.id)
			done()
		})
	})
