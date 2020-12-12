import jwt from 'jwt-simple'

export default function tokenForUser(userId) {
	const timestamp = new Date().getTime()
	return jwt.encode({ userId, timestamp: timestamp }, process.env.AUTH_SECRET)
}
