import { query, getClient } from '../db'

/**
 * Fetches a meta article by slug.
 * @param {String} slug
 */
async function fetchMetaArticle(slug, userId = null) {
	const dbClient = await getClient()
	const bookmarked = userId ? (await query('SELECT EXISTS(SELECT 1 FROM bookmarks WHERE articleSlug = $1 AND userId = $2)', [slug, userId])).rows[0].exists : null
	const read = userId ? (await query('SELECT EXISTS(SELECT 1 FROM reads WHERE articleSlug = $1 AND userId = $2)', [slug, userId])).rows[0].exists : null
	const article = {
		...(await query('SELECT * FROM metaArticles WHERE slug = $1', [slug]))
			.rows[0] || null,
		bookmarked,
		read
	}
	dbClient.release()
	return article
}

async function deleteMetaArticle(slug) {
	await query('DELETE FROM metaArticles WHERE slug = $1', [slug])
}

/**
 * Logs an artilce read for a user.
 * @param {String} slug
 * @param {String | undefined} userId
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

	if (userId) {
		await dbClient.query(
			'INSERT INTO reads (articleSlug, userId, timestamp) VALUES ($1, $2, $3)',
			[slug, userId, new Date().toUTCString()]
		)
		await dbClient.query('UPDATE users SET reads = reads + 1 WHERE id = $1', [
			userId,
		])
	} else {
		await dbClient.query(
			'INSERT INTO reads (articleSlug, timestamp) VALUES ($1, $2)',
			[slug, new Date().toUTCString()]
		)
	}
	await dbClient.query(
		'UPDATE metaArticles SET reads = reads + 1 WHERE slug = $1',
		[slug]
	)
	dbClient.release()
	return 'article read'
}

async function getReadArticles(userId) {
	const articles = (
		await query(
			'SELECT slug, timestamp FROM (SELECT articleSlug, timestamp FROM reads WHERE userId = $1) AS userReads LEFT JOIN (SELECT slug from metaArticles) AS matchingMetaArticles ON userReads.articleSlug = matchingMetaArticles.slug ORDER BY timestamp DESC',
			[userId]
		)
	).rows
	return articles
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
	return bookmarkExists ? 'deleted' : 'added'
}

/**
 * Queries a user's bookmarked articles, sorted by most recent timestamp.
 * @param {String} userId
 */
const getBookmarkedArticles = async (userId) => {
	const articles = (
		await query(
			'SELECT slug, timestamp FROM (SELECT articleSlug, timestamp FROM bookmarks WHERE userId = $1) AS userBookmarks LEFT JOIN (SELECT slug FROM metaArticles) AS matchingMetaArticles ON userBookmarks.articleSlug = matchingMetaArticles.slug ORDER BY timestamp DESC',
			[userId]
		)
	).rows
	return articles
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
	fetchMetaArticle,
	deleteMetaArticle,
	readArticle,
	getReadArticles,
	bookmarkArticle,
	getBookmarkedArticles,
	// shareArticle,
}
