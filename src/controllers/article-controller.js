import { query, getClient } from '../db'

/**
 * Fetches a meta article by slug.
 * @param {String} slug
 */
async function fetchMetaArticle(slug) {
	return await query('SELECT * FROM metaArticles WHERE slug=$1', [slug])
}

/**
 * Creates a meta article references by slug.
 * @param {String} slug
 */
async function createMetaArticle(slug) {
	await query('INSERT INTO metaArticles (slug) VALUES ($1)', [slug])
	return 'meta article created'
}

/**
 * Toggles article bookmark for a user.
 * @param {String} slug
 * @param {String} userId
 */
async function bookmarkArticle(slug, userId) {
	const dbClient = await getClient()
	const bookmarkExists = (
		await dbClient.query(
			'SELECT EXISTS(SELECT 1 FROM bookmarks WHERE articleSlug = $1 AND userId = $2)',
			[slug, userId]
		)
	).rows[0].exists
	if (bookmarkExists) {
		await dbClient.query(
			'DELETE FROM bookmarks WHERE articleSlug = $1 AND userId = $2',
			[slug, userId]
		)
	} else {
		await dbClient.query(
			'INSERT INTO bookmarks (articleSlug, userId, timestamp) VALUES ($1, $2, $3)',
			[slug, userId, new Date().toUTCString()]
		)
	}
	dbClient.release()
	return bookmarkExists ? 'bookmark deleted' : 'bookmark added'
}

/**
 * Logs an artilce read for a user.
 * @param {String} slug
 * @param {String} userId
 */
async function readArticle(slug, userId) {
	const dbClient = await getClient()

	let metaArticle = (
		await dbClient.query(
			'SELECT EXISTS(SELECT 1 FROM metaArticles WHERE slug = $1)',
			[slug]
		)
	).rows[0].exists
	if (!metaArticle) {
		metaArticle = dbClient.query(
			'INSERT INTO metaArticles (slug) VALUES ($1)',
			[slug]
		)
	}

	await dbClient.query(
		'INSERT INTO reads (articleSlug, userId, timestamp) VALUES ($1, $2, $3)',
		[slug, userId, new Date().toUTCString()]
	)
	await dbClient.query(
		'UPDATE metaArticles SET reads = reads + 1 WHERE slug = $1',
		[slug]
	)
	dbClient.release()
	return 'article read'
}

// async function shareArticle(article, user) {
// 	const dbArticle = await Articles.findById(article.slug)
// 	if (user) {
// 		const sharedUser = dbArticle.sharedUsers.find((item) => {
// 			return user._id.equals(item)
// 		})
// 		if (!sharedUser) {
// 			dbArticle.sharedUsers.push(user._id)
// 		}
// 	}
// 	await dbArticle.save()
// 	return dbArticle
// }

export default {
	createMetaArticle,
	fetchMetaArticle,
	readArticle,
	bookmarkArticle,
	// shareArticle,
}
