import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';

import User from '../models/user_model';

dotenv.config({ silent: true });

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET,
};

const jwtLogin = new JwtStrategy(jwtOptions, (payload, done) => {
  // See if the token matches any user document in the DB
  // Done function in the form -> "done(resulting error, resulting user)"
  User.findById(payload.sub, (err, user) => {
    // This logic can be modified to check for user attributes
    if (err) {
      return done(err, false); // Error return
    } else if (user) {
      return done(null, user); // Valid user return
    } else {
      return done(null, false); // Catch no valid user return
    }
  });
});

passport.use(jwtLogin);

const requireAuth = passport.authenticate('jwt', { session: false });

export default requireAuth;
