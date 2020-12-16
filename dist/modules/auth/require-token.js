"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _passport = _interopRequireDefault(require("passport"));

var _passportJwt = require("passport-jwt");

var _db = require("../../db");

var _dotenv = _interopRequireDefault(require("dotenv"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable func-names */
_dotenv.default.config({
  silent: true
});

const jwtOptions = {
  jwtFromRequest: _passportJwt.ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_SECRET
};
const jwtAuthLogin = new _passportJwt.Strategy(jwtOptions, async (payload, done) => {
  const user = (await (0, _db.query)('SELECT id FROM users WHERE id = $1', [payload.userId])).rows[0] || null;

  if (user) {
    return done(null, user);
  } else {
    return done(null, false);
  }
});

_passport.default.use('jwt-auth', jwtAuthLogin); // Create function to transmit result of authenticate() call to user or next middleware


const requireToken = options => function (req, res, next) {
  if (req.headers['api_key'] === process.env.API_KEY) {
    req.admin = true;
    next();
  } else if (!options.admin) {
    _passport.default.authenticate('jwt-auth', {
      session: false
    }, function (err, user, info) {
      if (err) {
        return next(err);
      }

      if (!user && !options.optional) {
        return res.status(401).json({
          message: info ? info.message : 'Authentication Error: Not authorized to perform this request'
        });
      }

      req.user = user;
      return next();
    })(req, res, next);
  } else {
    return res.sendStatus(401);
  }
};

var _default = requireToken;
exports.default = _default;