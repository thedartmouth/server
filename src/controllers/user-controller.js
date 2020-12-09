import { query, getClient } from '../db'
import format from 'pg-format'

class UserSchema {
	id
	firstName
	lastName
	email
	password
	reads
}

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

/**
 * Creates a new user.
 * @param {UserSchema} user 
 */
const createUser = async (user) => {
	const values = Object.keys(new UserSchema()).map(key => {
		const value = key in user ? format.literal(user[key]) : 'DEFAULT'
		if (format.ident(key.toLowerCase()) === 'password') {
			return `crypt(${value}, gen_salt('bf', 8))`
		}
		return value
			
	}).join(',')
	console.log(values)
	await query(`INSERT INTO users (id, firstName, lastName, email, passhash, reads) VALUES (${values})`)
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

/**
 * Updates fields for basic user data.
 * @param {String} userId 
 * @param {UserSchema} updates 
 */
const updateBasicUserData = async (userId, updates) => {
	const values = Object.keys(new UserSchema()).map(key => {
		const value = key in updates ? format.literal(updates[key]) : 'DEFAULT'
		if (format.ident(key.toLowerCase()) === 'password') {
			return `passhash = crypt(${value}, gen_salt('bf', 8))`
		}
		return `${format.ident(key.toLowerCase())} = ${value}`
			
	}).join(',')
	console.log(values)
	await query(`UPDATE users SET ${values} WHERE id = $1`, [userId])
}

/**
 * Deletes a user and associated reads and bookmarks from tables.
 * @param {String} userId 
 */
const deleteUser = async (userId) => {
	const dbClient = await getClient()
	await dbClient.query('DELETE FROM users WHERE id = $1', [userId])
	await dbClient.query('DELETE FROM bookmarks WHERE userId = $1', [userId])
	await dbClient.query('DELETE FROM reads WHERE userId = $1', [userId])
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
	deleteUser,
	getBasicUserData,
	getBookmarkedArticles,
	updateBasicUserData,
	validateUserExistence
}
