import passport from 'passport';
import LocalStrategy from 'passport-local';
import User from '../models/user_model';

// Configure what LocalStrategy will check for as a username
const localOptions = { usernameField: 'email' };

// Make a login strategy to check email and password against DB
const localLogin = new LocalStrategy(localOptions, (email, password, done) => {
  // Validation of parameters
  if (!email || !password) {
    return done(new Error('You must provide an email and password'));
  }

  return User.findOne({ email }, (error, user) => {
    // Was a user with the given email able to be found?
    if (error) return done(error);
    if (!user) return done(null, false);

    // Compare password associated with email and passed password
    return user.comparePassword(password, (err, isMatch) => {
      if (err) {
        done(err);
      } else if (!isMatch) {
        done(null, false);
      } else {
        done(null, user);
      }
    });
  });
});

passport.use(localLogin);

const requireSignin = passport.authenticate('local', { session: false });
export default requireSignin;
