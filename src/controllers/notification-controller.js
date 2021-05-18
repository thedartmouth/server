import { query, getClient } from '../db'
import tagController from './tag-controller'
import { Notification, fireNotification } from '../modules/notifications'
import { fetchArticle } from '../modules/ceo'

async function checkToken(token, userId) {
	if (!token) throw new Error('Missing token.')
	const dbClient = await getClient()
	const existingToken = (
		await dbClient.query(
			'SELECT token FROM notificationTokens WHERE token = $1 LIMIT 1',
			[token]
		)
	).rows[0]?.token
	if (!existingToken) {
		if (userId) {
			await dbClient.query(
				'INSERT INTO notificationTokens (token, userId) VALUES ($1, $2)',
				[token, userId]
			)
		} else {
			await dbClient.query(
				'INSERT INTO notificationTokens (token) VALUES ($1)',
				[token]
			)
		}
	}
	dbClient.release()
	return existingToken ? 200 : 201
}

async function deleteToken(token) {
	await query('DELETE FROM notificationTokens WHERE token = $1', [token])
}

async function getSettings(token) {
	if (!token) throw new Error('Missing token.')
	return (
		await query(
			'SELECT * FROM notificationSettings LEFT JOIN tags ON notificationSettings.tagSlug = tags.slug WHERE notificationSettings.notificationToken = $1',
			[token]
		)
	).rows
}

async function updateSettings(token, settings) {
	const dbClient = await getClient()
	if (!token) throw new Error('Missing token.')
	if (settings) {
		const res = await Promise.allSettled(
			Object.entries(settings).map(async ([tagSlug, active]) => {
				if (typeof tagSlug !== 'string')
					throw new Error('Tag slug must be a string.')
				if (typeof active !== 'boolean')
					throw new Error('Active label on tag must be a boolean.')
				const tag = (
					await dbClient.query('SELECT 1 FROM tags WHERE slug = $1', [
						tagSlug,
					])
				).rows
				if (!tag.length) throw new Error(`Invalid tag slug ${tagSlug}.`)
				const existingSetting = (
					await dbClient.query(
						'SELECT 1 FROM notificationSettings WHERE notificationToken = $1 AND tagSlug = $2',
						[token, tagSlug]
					)
				).rows
				if (existingSetting.length) {
					await dbClient.query(
						'UPDATE notificationSettings SET active = $1 WHERE notificationToken = $2 AND tagSlug = $3',
						[active, token, tagSlug]
					)
				} else {
					await dbClient.query(
						'INSERT INTO notificationSettings (notificationToken, active, tagSlug) VALUES ($1, $2, $3)',
						[token, active, tagSlug]
					)
				}
				return tagSlug
			})
		)
		return {
			success: res.filter((r) => r.status === 'fulfilled'),
			failed: res.filter((r) => r.status === 'rejected'),
		}
	}
	dbClient.release()
}

async function postDirect(notification) {
	const dbClient = await getClient()

	if (!notification.type) throw new Error('missing {type}')

	let { title, body } = notification

	switch (notification.type) {
		case 'ARTICLE':
			let { tagSlug, articleSlug } = notification
			if (!articleSlug) throw new Error('Missing articleSlug.')
			const tag = await tagController.getTag(tagSlug)
			if (!tag) throw new Error(`Cannot find tag with slug ${tagSlug}.`)
			fetchArticle(articleSlug)
				.then(async (article) => {
					if (!body) {
						body = article.headline
					}
					if (!title) {
						switch (tag.type) {
							case 'AUTHOR':
								title = 'Author you follow'
								break
							case 'ARTICLE':
								title = tag.name ?? tag.slug.toUpperCase()
								break
						}
					}
					const id = (
						await dbClient.query(
							'INSERT INTO notifications (type, title, body, createdTime, tagSlug, articleSlug) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id',
							[
								notification.type,
								title,
								body,
								new Date().toUTCString(),
								tagSlug,
								articleSlug,
							]
						)
					).rows[0]?.id
					await fireNotification(
						new Notification(id, notification.type, {
							tagSlug,
							articleSlug,
							title,
							body,
						})
					)
				})
				.catch((e) => {
					throw new Error(
						`Failed due to exception in fetching article with slug ${articleSlug}, ${e}.`
					)
				})
			break
		case 'GENERAL':
			if (!title || !body)
				throw new Error('Missing title and body for notitification.')
			const id = (
				await dbClient.query(
					'INSERT INTO notifications (type, title, body, createdTime) VALUES ($1, $2, $3, $4) RETURNING id',
					[notification.type, title, body, new Date().toUTCString()]
				)
			).rows[0]?.id
			await fireNotification(
				new Notification(id, notification.type, {
					title,
					body,
				})
			)
			break
		default:
			throw new Error('invalid {type}')
	}
	dbClient.release()
}

export default {
	getSettings,
	updateSettings,
	checkToken,
	deleteToken,
	postDirect,
}
