"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/* eslint-disable func-names */
const AuthorSchema = new _mongoose.Schema({
  _id: {
    type: String
  },
  // in case this is ever convenient
  name: {
    type: String,
    index: true
  },
  followers: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
}); // query helper to do case insensitive name lookup

AuthorSchema.query.byName = function (name) {
  return this.where({
    name: new RegExp(`^${name}$`, 'i')
  });
};

const AuthorModel = _mongoose.default.model('Author', AuthorSchema);

var _default = AuthorModel;
exports.default = _default;