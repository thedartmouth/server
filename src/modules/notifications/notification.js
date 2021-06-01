import { query } from '../../db'
export class Notification {
	id
	type
	title
	body
	targetTime // when this notification should trigger on client devices
	createdTime // when this notification was created
	triggered
	tagSlug
	articleSlug

	constructor(id, type, { title, body, tagSlug, articleSlug }, targetTime) {
		this.id = id
		this.type = type
		switch (type) {
			case 'ARTICLE':
				this.title = title
				this.body = body
				this.tagSlug = tagSlug
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
						'INSERT INTO notifications (type, title, body, createdTime, tagSlug, articleSlug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
						[
							this.type,
							this.title,
							this.body,
							new Date().toUTCString(),
							this.tagSlug,
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
						tagSlug: res['tagSlug'.toLowerCase()],
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
}
