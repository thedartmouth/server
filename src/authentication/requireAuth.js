/* eslint-disable func-names */
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import jwt from 'jwt-simple'
import dotenv from 'dotenv'

import User from '../models/user-model'

dotenv.config({ silent: true })

const jwtOptions = {
	jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
	secretOrKey: process.env.AUTH_SECRET,
}

export function tokenForUser(user) {
	const timestamp = new Date().getTime()
	return jwt.encode({ sub: user.id, iat: timestamp }, process.env.AUTH_SECRET)
}

const jwtAuthLogin = new JwtStrategy(jwtOptions, (payload, done) => {
	// See if the token matches any user document in the DB
	// Done function in the form -> "done(resulting error, resulting user)"
	User.findById(payload.sub, (err, user) => {
		// This logic can be modified to check for user attributes
		if (err) {
			return done(err, false) // Error return
		} else if (user) {
			return done(null, user) // Valid user return
		} else {
			return done(null, false) // Catch no valid user return
		}
	})
})

passport.use('jwt-auth', jwtAuthLogin)

// Create function to transmit result of authenticate() call to user or next middleware
const requireAuth = (options) => function (req, res, next) {
	if (req.headers.API_KEY === process.env.API_KEY) {
		req.admin = true
		next()
	}
	else if (!options.admin) {
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
		return res.setStatus(401)
	}
}

export default requireAuth
