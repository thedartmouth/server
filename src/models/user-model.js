/* eslint-disable func-names */
import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: '' },
  created_date: { type: Date, default: Date.now() },
  is_admin: { type: Schema.Types.Boolean, default: false },
  bookmarkedArticles: { type: String, ref: 'Article' },
  followedAuthors: [
    { type: Schema.Types.ObjectId, ref: 'Author' },
  ],
  followedTags: [
    { type: Schema.Types.ObjectId, ref: 'Tag' },
  ],
}, {
  toObject: {
    virtuals: true,
  },
  toJSON: {
    virtuals: true,
  },
});

const saltRounds = 10;

// Add a preprocessing function to the user's save function to hash password before saving
UserSchema.pre('save', function (next) {
  // Check if password needs to be rehashed
  if (this.isNew || this.isModified('password')) {
    const document = this; // Save reference to current scope

    // Hash and save document password
    bcrypt.hash(document.password, saltRounds, (error, hashedPassword) => {
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
});

// Add a method to the user model to compare passwords
// Boolean "same" returns whether or not the passwords match to callback function
UserSchema.methods.comparePassword = function (password, callback) {
  bcrypt.compare(password, this.password, (error, same) => {
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
});

// query helper to do case insensitive email lookup
UserSchema.query.byEmail = function (email) {
  return this.where({ email: new RegExp(email, 'i') });
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;