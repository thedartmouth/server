import Expo from 'expo-server-sdk'
import { tagController } from '../../controllers'
import { query } from '../../db'
import { fetchArticle } from '../ceo'
export class Notification {
	id
	type
	title
	body
	targetTime // when this notification should trigger on client devices
	createdTime // when this notification was created
	triggered
	articleSlug

	constructor(id, type, { title, body, articleSlug }, targetTime) {
		this.id = id
		this.type = type
		switch (type) {
			case 'ARTICLE':
				this.title = 'NEWS'
				this.body = body
				this.articleSlug = articleSlug
				break
			case 'GENERAL':
				this.title = title
				this.body = body
				break
			default:
				throw new Error(`Invalid notification type, received ${type}.`)
		}
		this.targetTime = targetTime
		this.createdTime = new Date()
		this.triggered = false
	}

	/**
	 * Saves a notification to the table.
	 * Throws error if this notification is already saved.
	 * @returns
	 */
	async save() {
		if (this.id)
			throw new Error(
				`Bad attempt trying to save a notification with ID = ${this.id} that is already saved.`
			)
		switch (this.type) {
			case 'ARTICLE':
				this.id = (
					await query(
						'INSERT INTO notifications (type, title, body, createdTime, articleSlug) VALUES ($1, $2, $3, $4, $5) RETURNING id',
						[
							this.type,
							this.title,
							this.body,
							new Date().toUTCString(),
							this.articleSlug,
						]
					)
				).rows[0]?.id
				break
			case 'GENERAL':
				this.id = (
					await query(
						'INSERT INTO notifications (type, title, body, createdTime) VALUES ($1, $2, $3, $4) RETURNING id',
						[this.type, this.title, this.body, new Date().toUTCString()]
					)
				).rows[0]?.id
				break
		}
		return this.id
	}

	/**
	 * Fetches and returns a new Notification instance from the table.
	 * @param {string} id
	 * @returns
	 */
	static async fetchById(id) {
		console.log('fetchById', id)
		try {
			if (!id) throw new Error('Missing id.')

			let notification
			const res = (
				await query('SELECT * FROM notifications WHERE id = $1 LIMIT 1', [
					id,
				])
			).rows[0]
			console.log('fetchById', res)
			switch (res.type) {
				case 'ARTICLE':
					notification = new Notification(id, res.type, {
						title: res.title,
						body: res.body,
						articleSlug: res['articleSlug'.toLowerCase()],
					})
					break
				case 'GENERAL':
					notification = new Notification(id, res.type, {
						title: res.title,
						body: res.body,
					})
					break
				default:
					throw new Error(`Bad notification type, recieved ${res.type}.`)
			}
			return notification
		} catch (e) {
			console.error(e)
			throw new Error(e)
		}
	}

	async generateTargetAudience() {
		const audience = {}
		switch (this.type) {
			case 'ARTICLE': {
				const article = await fetchArticle(this.articleSlug)
				const tags = (
					await Promise.allSettled(
						article.tags?.map(({ slug }) => tagController.getTag(slug))
					)
				)
					.filter(({ status }) => status === 'fulfilled')
					.map(({ value }) => value)
				await Promise.allSettled(
					tags
						.sort((a, b) => a.rank - b.rank)
						.map(async (tag) => {
							if (tag) {
								let title
								switch (tag.type) {
									case 'AUTHOR':
										title = 'Author you follow'
										break
									case 'ARTICLE':
										title = tag.name ?? tag.slug.toUpperCase()
										break
								}

								const tagAudience = (
									await query(
										"SELECT token FROM (SELECT notificationToken FROM notificationSettings WHERE tagSlug = $1 AND active = 'true') AS targetUsers LEFT JOIN notificationTokens ON targetUsers.notificationToken = notificationTokens.token",
										[tag.slug]
									)
								).rows

								if (tagAudience.length) {
									console.log(tag.slug)
								}

								tagAudience
									.filter(({ token }) => Expo.isExpoPushToken(token))
									.forEach(({ token }) => {
										if (!(token in audience)) {
											audience[token] = {
												to: token,
												sound: 'default',
												title,
												body: this.body,
												data: {
													notificationId: this.id,
													token,
													articleSlug: this.articleSlug,
												},
											}
										}
									})
							}
						})
				)
				break
			}
			case 'GENERAL':
				const initialAudience = (
					await query('SELECT token FROM notificationTokens')
				).rows
				initialAudience
					.filter(({ token }) => Expo.isExpoPushToken(token))
					.forEach(({ token }) => {
						if (!(token in audience)) {
							audience[token] = {
								to: token,
								sound: 'default',
								title: this.title,
								body: this.body,
								data: { notificationId: this.id, token },
							}
						}
					})
				break
		}
		return Object.values(audience)
	}
}
