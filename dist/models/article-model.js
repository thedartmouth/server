"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const ArticleSchema = new _mongoose.Schema({
  _id: {
    type: String
  },
  // slug of the article
  uuid: {
    type: String,
    unique: true
  },
  // keep uuid in case
  associatedPolls: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'Poll'
  }],
  viewedUsers: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // this.length = # views
  bookMarkedUsers: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  // this.length = # bookmarks
  sharedUsers: [{
    type: _mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }] // may or may not need # shares per user

});

const ArticleModel = _mongoose.default.model('Article', ArticleSchema);

var _default = ArticleModel;
exports.default = _default;