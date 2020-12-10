import { query, getClient } from '../db'
import { UserValidationError } from '../modules/error'
import format from 'pg-format'
import jwt from 'jwt-simple'

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
 * @param {Express.Response} res
 * @param {String} userId
 */
const validateUserExistence = (userId) => async (res) => {
	if (!userId) {
		res.status(400).send('missing userId')
		throw new UserValidationError()
	}
	const user =
		(await query('SELECT 1 FROM users WHERE id = $1', [userId])).rows[0] ||
		null
	if (!user) {
		res.status(404).send(`specified userId ${userId} does not exist`)
		throw new UserValidationError()
	}
}

/**
 * Creates a new user.
 * @param {UserSchema} user
 */
const createUser = async (user) => {
	const values = Object.keys(new UserSchema())
		.map((key) => {
			const value = key in user ? format.literal(user[key]) : 'DEFAULT'
			if (format.ident(key.toLowerCase()) === 'password') {
				return `crypt(${value}, gen_salt('bf', 8))`
			}
			return value
		})
		.join(',')
	return (
		await query(
			`INSERT INTO users (id, firstName, lastName, email, passhash, reads) VALUES (${values}) RETURNING id`
		)
	).rows[0]?.id
}

const generateToken = async (email, password) => {
	let token = ''
	const userId =
		(
			await query(
				'SELECT id FROM users WHERE email = $1 AND passhash = crypt($2, passhash)',
				[email, password]
			)
		).rows[0]?.id || null
	if (userId) {
		token = jwt.encode(
			{ userId, timestamp: new Date().getTime() },
			process.env.AUTH_SECRET
		)
		return { token, userId }
	}
	throw new Error('invalid credentials')
}

/**
 * Returns basic user data.
 * @param {String} userId
 */
const getBasicUserData = async (userId) => {
	const dbClient = await getClient()
	const user = (
		await dbClient.query(
			'SELECT firstName, lastName, email, reads FROM users WHERE id = $1',
			[userId]
		)
	).rows[0]
	const res = {
		name: {
			first: user.firstname,
			last: user.lastname,
		},
		email: user.email,
		reads: parseInt(user.reads),
	}
	return res
}

/**
 * Updates fields for basic user data.
 * @param {String} userId
 * @param {UserSchema} updates
 */
const updateBasicUserData = async (userId, updates) => {
	const values = Object.keys(new UserSchema())
		.map((key) => {
			const value = key in updates ? format.literal(updates[key]) : 'DEFAULT'
			if (format.ident(key.toLowerCase()) === 'password') {
				return `passhash = crypt(${value}, gen_salt('bf', 8))`
			}
			return `${format.ident(key.toLowerCase())} = ${value}`
		})
		.join(',')
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
	dbClient.release()
}

export default {
	validateUserExistence,
	createUser,
	generateToken,
	getBasicUserData,
	updateBasicUserData,
	deleteUser,
}
