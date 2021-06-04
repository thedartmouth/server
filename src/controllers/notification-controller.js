import { query, getClient } from '../db'
import tagController from './tag-controller'
import { Notification, fireNotification } from '../modules/notifications'
import { fetchArticle } from '../modules/ceo'

const DEFAULT_NOTIFICATION_TAGS = new Set([
	['top-story', true]
	['top-picture', false]
	['cartoon-of-the-day', true]
	['featured', false]
	['student-spotlights', false]
	['verbum-ultimum', false]
	['news', false]
	['covid-19', true]
	['opinion', false]
	['sports', false]
	['arts', false]
	['mirror', false]
	['cartoon', false]
])

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
		Array.from(DEFAULT_NOTIFICATION_TAGS).forEach(([slug, active]) => {
			query(
				'INSERT INTO notificationSettings (notificationToken, active, tagSlug) VALUES ($1, $2, $3)',
				[token, active, slug]
			)
		})
	} else {
		if (userId) {
			await dbClient.query(
				'UPDATE notificationTokens SET userId = $1 WHERE token = $2',
				[userId, token]
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
					await dbClient.query(
						'SELECT EXISTS(SELECT FROM tags WHERE slug = $1 LIMIT 1)',
						[tagSlug]
					)
				).rows[0].exists
				if (!tag) throw new Error(`Invalid tag slug ${tagSlug}.`)
				const existingSetting = (
					await dbClient.query(
						'SELECT FROM notificationSettings WHERE notificationToken = $1 AND tagSlug = $2',
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
		dbClient.release()
		return {
			success: res.filter((r) => r.status === 'fulfilled'),
			failed: res.filter((r) => r.status === 'rejected'),
		}
	}
	dbClient.release()
}

async function postGeneralNotification(title, body) {
	if (!title || !body)
		throw new Error('Missing title and body for notitification.')

	const createdNotification = new Notification(null, 'GENERAL', {
		title,
		body,
	})

	const notificationId = await createdNotification.save()

	await fireNotification(notificationId)
}

async function postArticleNotification(articleSlug) {
	let notifications
	let failedTags

	if (!articleSlug) throw new Error('Missing articleSlug.')

	const article = await fetchArticle(articleSlug)
	try {
		const res = await Promise.allSettled(
			article.tags?.map(async ({ slug: tagSlug }) => {
				const tag = await tagController.getTag(tagSlug)
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
					const createdNotification = new Notification(null, 'ARTICLE', {
						title,
						body: article.headline,
						tagSlug,
						articleSlug,
					})
					const notificationId = await createdNotification.save()
					if (tag.rank > -1) {
						return { notificationId, tag }
					} else {
						throw new Error(
							`Notification for tag ${tagSlug} has unset rank.`
						)
					}
				} else {
					throw new Error(
						`Notification for tag with slug ${tagSlug} not found.`
					)
				}
			})
		)
		notifications = res
			.filter((r) => r.status === 'fulfilled')
			.map((r) => r.value)
		failedTags = res
			.filter((r) => r.status === 'rejected')
			.map((r) => r.reason)
	} catch (e) {
		throw new Error(
			`Failed due to exception in fetching article with slug ${articleSlug}, ${e}.`
		)
	}

	if (!notifications) throw new Error('Article has no tags to notify by.')

	notifications.sort((a, b) => a.tag.rank - b.tag.rank)

	await Promise.all(
		notifications
			// .slice(0, 3)
			.map((notification) => fireNotification(notification.notificationId))
	)

	return { sentTags: notifications.map(({ tag }) => tag.slug), failedTags }
}

export default {
	getSettings,
	updateSettings,
	checkToken,
	deleteToken,
	postGeneralNotification,
	postArticleNotification,
}
