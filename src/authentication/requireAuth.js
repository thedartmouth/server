/* eslint-disable func-names */
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jwt-simple'
import { query } from '../db'
import dotenv from 'dotenv'

dotenv.config({ silent: true })

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.AUTH_SECRET,
}

export function tokenForUser(user) {
	const timestamp = new Date().getTime()
	return jwt.encode({ userId: user.id, timestamp: timestamp }, process.env.AUTH_SECRET)
}

const jwtAuthLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
	const user = (await query('SELECT id FROM users WHERE id = $1', [payload.userId])) || null
	if (user) {
		return done(null, user)
	} else {
		return done(null, false)
	}
})

passport.use('jwt-auth', jwtAuthLogin)

// Create function to transmit result of authenticate() call to user or next middleware
const requireAuth = (options) =>
	function (req, res, next) {
		if (req.headers['api_key'] === process.env.API_KEY) {
			req.admin = true
			next()
		} else if (!options.admin) {
			passport.authenticate(
				'jwt-auth',
				{ session: false },
				function (err, user, info) {
					if (err) {
						return next(err)
					}

					if (!user) {
						return res.status(401).json({
							message: info
								? info.message
								: 'Authentication Error: Not authorized to perform this request',
						})
					}

					req.user = user

					return next()
				}
			)(req, res, next)
		} else {
			return res.sendStatus(401)
		}
	}

export default requireAuth
