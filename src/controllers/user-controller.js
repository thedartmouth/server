import { Users } from '../models'
import { query } from '../db'

const validateUserExistence = async (req, res, next, userId) => {
	if (!userId) res.status(400).send('missing userId')
	const user =
		(await query('SELECT 1 FROM users WHERE id = $1', [userId])).rows[0] ||
		null
	if (!user) res.status(404).send(`specified userId ${userId} does not exist`)
	next()
}

async function getUsers(filters) {
	const results = await Users.find(filters).exec()
	for (let result of results) {
		result = redactUser(result.toObject())
	}
	return results
}

function removeDocPassword(user) {
	delete user._doc.password
	return user
}

function redactDocUser(user) {
	delete user._doc.created_date
	delete user._doc.password
	return user
}

function removePassword(user) {
	delete user.password
	return user
}

function redactUser(user) {
	delete user.created_date
	delete user.password
	return user
}

export default {
	validateUserExistence,
	getUsers,
	removePassword,
	redactUser,
	removeDocPassword,
	redactDocUser,
}
