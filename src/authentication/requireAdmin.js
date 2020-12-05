/* eslint-disable func-names */
import passport from 'passport'
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt'
import dotenv from 'dotenv'

import User from '../models/user-model'

dotenv.config({ silent: true })

const jwtOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.AUTH_SECRET,
}

const jwtAdminLogin = new JwtStrategy(jwtOptions, (payload, done) => {
    // See if the token matches any user document in the DB
    // Done function in the form -> "done(resulting error, resulting user)"
    User.findById(payload.sub, (err, user) => {
        // This logic can be modified to check for user attributes
        if (err) {
            return done(err, false) // Error return
        } else if (user && user.is_admin) {
            return done(null, user) // Valid user return
        } else {
            return done(null, false) // Catch not admin return
        }
    })
})

passport.use('jwt-admin', jwtAdminLogin)

// Create function to transmit result of authenticate() call to user or next middleware
const requireAdmin = function (req, res, next) {
    // eslint-disable-next-line prefer-arrow-callback
    passport.authenticate(
        'jwt-admin',
        { session: false },
        function (err, user, info) {
            // Return any existing errors
            if (err) {
                return next(err)
            }

            // If no user found, return appropriate error message
            if (!user) {
                return res
                    .status(401)
                    .json({
                        message: info
                            ? info.message
                            : 'Authentication Error: Not authorized to perform this request',
                    })
            }

            req.user = user

            return next()
        }
    )(req, res, next)
}

export default requireAdmin
