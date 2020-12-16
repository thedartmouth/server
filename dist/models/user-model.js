"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

var _bcryptjs = _interopRequireDefault(require("bcryptjs"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable func-names */
const UserSchema = new _mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  created_date: {
    type: Date,
    default: Date.now()
  },
  is_admin: {
    type: _mongoose.Schema.Types.Boolean,
    default: false
  },
  bookmarkedArticles: [{
    type: String,
    ref: 'Article'
  }],
  followedAuthors: [{
    type: String,
    ref: 'Author'
  }],
  followedTags: [{
    type: String,
    ref: 'Tag'
  }]
}, {
  toObject: {
    virtuals: true
  },
  toJSON: {
    virtuals: true
  }
});
const saltRounds = 10; // Add a preprocessing function to the user's save function to hash password before saving

UserSchema.pre('save', function (next) {
  // Check if password needs to be rehashed
  if (this.isNew || this.isModified('password')) {
    const document = this; // Save reference to current scope
    // Hash and save document password

    _bcryptjs.default.hash(document.password, saltRounds, (error, hashedPassword) => {
      if (error) {
        next(error);
      } else {
        document.password = hashedPassword;
        next();
      }
    });
  } else {
    next();
  }
}); // Add a method to the user model to compare passwords
// Boolean "same" returns whether or not the passwords match to callback function

UserSchema.methods.comparePassword = function (password, callback) {
  _bcryptjs.default.compare(password, this.password, (error, same) => {
    if (error) {
      callback(error);
    } else {
      callback(error, same);
    }
  });
};

UserSchema.virtual('url').get(function () {
  if (this.is_admin) {
    return '';
  } else {
    return this.name ? this.name.toLowerCase().split(' ').join('-') : this._id;
  }
}); // query helper to do case insensitive email lookup

UserSchema.query.byEmail = function (email) {
  return this.where({
    email: new RegExp(`^${email}$`, 'i')
  });
};

const UserModel = _mongoose.default.model('User', UserSchema);

var _default = UserModel;
exports.default = _default;