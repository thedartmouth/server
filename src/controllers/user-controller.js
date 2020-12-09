import { query, getClient } from '../db'
import format from 'pg-format'

/**
 * Middleware to validate a user exists for routes that require querying on a specific user.
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 * @param {*} userId 
 */
const validateUserExistence = async (req, res, next, userId) => {
	if (!userId) res.status(400).send('missing userId')
	const user =
		(await query('SELECT 1 FROM users WHERE id = $1', [userId])).rows[0] ||
		null
	if (!user) res.status(404).send(`specified userId ${userId} does not exist`)
	next()
}

const createUser = async (user) => {
	const user = Object.entries(user).map(entry => {
		return `${format.ident(entry[0])} = ${format.literal(entry[1])}`
	}).join(',')
}

/**
 * Returns basic user data.
 * @param {String} userId 
 */
const getBasicUserData = async (userId) => {
	const dbClient = await getClient()
	const user = (
		await dbClient.query(
			'SELECT firstName, lastName, email, reads FROM users WHERE userId = $1',
			[userId]
		)
	).rows[0]
	const res = {
		name: {
			first: user.firstName,
			last: user.lastName,
		},
		email: user.email,
		reads: user.reads,
	}
	return res
}

const updateBasicUserData = async (userId, updates) => {
	const updates = Object.entries(updates).map(entry => {
		return `${format.ident(entry[0])} = ${format.literal(entry[1])}`
	}).join(',')
	await query(`UPDATE users SET ${updates} WHERE id = $1`, [userId])
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

export default {
	createUser,
	validateUserExistence,
	getBasicUserData,
	updateBasicUserData,
	getBookmarkedArticles,
}
