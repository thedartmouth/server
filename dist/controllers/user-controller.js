"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = exports.UserSchema = void 0;

var _db = require("../db");

var _auth = require("../modules/auth");

var _error = require("../modules/error");

var _pgFormat = _interopRequireDefault(require("pg-format"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

class UserSchema {
  constructor() {
    _defineProperty(this, "id", void 0);

    _defineProperty(this, "firstName", void 0);

    _defineProperty(this, "lastName", void 0);

    _defineProperty(this, "email", void 0);

    _defineProperty(this, "password", void 0);

    _defineProperty(this, "reads", void 0);
  }

}
/**
 * Middleware to validate a user exists for routes that require querying on a specific user.
 * @param {Express.Response} res
 * @param {String} userId
 */


exports.UserSchema = UserSchema;

const validateUserExistence = userId => async res => {
  if (!userId) {
    res.status(400).send('missing userId');
    throw new _error.UserValidationError();
  }

  const user = (await (0, _db.query)('SELECT 1 FROM users WHERE id = $1', [userId])).rows[0] || null;

  if (!user) {
    res.status(404).send(`specified userId ${userId} does not exist`);
    throw new _error.UserValidationError();
  }
};
/**
 * Creates a new user.
 * @param {UserSchema} user
 */


const createUser = async user => {
  const formattedUser = {
    firstName: user.name?.first,
    lastName: user.name?.last,
    email: user.email,
    password: user.password
  };
  const values = Object.keys(new UserSchema()).map(key => {
    const value = key in formattedUser ? _pgFormat.default.literal(formattedUser[key]) : 'DEFAULT';

    if (_pgFormat.default.ident(key.toLowerCase()) === 'password') {
      return `crypt(${value}, gen_salt('bf', 8))`;
    }

    return value;
  }).join(',');
  const userId = (await (0, _db.query)(`INSERT INTO users (id, firstName, lastName, email, passhash, reads) VALUES (${values}) RETURNING id`)).rows[0]?.id;
  return {
    userId,
    token: (0, _auth.generateToken)(userId)
  };
};

const generateTokenForUser = async (email, password) => {
  let token = '';
  const userId = (await (0, _db.query)('SELECT id FROM users WHERE email = $1 AND passhash = crypt($2, passhash)', [email, password])).rows[0]?.id || null;

  if (userId) {
    token = (0, _auth.generateToken)(userId);
    return {
      token,
      userId
    };
  }

  throw new _error.UserValidationError('invalid credentials');
};
/**
 * Returns basic user data.
 * @param {String} userId
 */


const getBasicUserData = async userId => {
  const dbClient = await (0, _db.getClient)();
  const user = (await dbClient.query('SELECT firstName, lastName, email, reads FROM users WHERE id = $1', [userId])).rows[0];
  const res = {
    name: {
      first: user.firstname,
      last: user.lastname
    },
    email: user.email,
    reads: parseInt(user.reads)
  };
  dbClient.release();
  return res;
};
/**
 * Updates fields for basic user data.
 * @param {String} userId
 * @param {UserSchema} updates
 */


const updateBasicUserData = async (userId, updates) => {
  const values = Object.keys(new UserSchema()).filter(key => key !== 'id').map(key => {
    const value = key in updates ? _pgFormat.default.literal(updates[key]) : 'DEFAULT';

    if (_pgFormat.default.ident(key.toLowerCase()) === 'password') {
      return `passhash = crypt(${value}, gen_salt('bf', 8))`;
    } else return `${_pgFormat.default.ident(key.toLowerCase())} = ${value}`;
  }).join(',');
  await (0, _db.query)(`UPDATE users SET ${values} WHERE id = $1`, [userId]);
};
/**
 * Deletes a user and associated reads and bookmarks from tables.
 * @param {String} userId
 */


const deleteUser = async userId => {
  const dbClient = await (0, _db.getClient)();
  await dbClient.query('DELETE FROM users WHERE id = $1', [userId]);
  await dbClient.query('DELETE FROM bookmarks WHERE userId = $1', [userId]);
  await dbClient.query('DELETE FROM reads WHERE userId = $1', [userId]);
  dbClient.release();
};

var _default = {
  validateUserExistence,
  createUser,
  generateTokenForUser,
  getBasicUserData,
  updateBasicUserData,
  deleteUser
};
exports.default = _default;