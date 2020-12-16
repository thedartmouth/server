"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Users", {
  enumerable: true,
  get: function () {
    return _userModel.default;
  }
});
Object.defineProperty(exports, "Articles", {
  enumerable: true,
  get: function () {
    return _articleModel.default;
  }
});
Object.defineProperty(exports, "Authors", {
  enumerable: true,
  get: function () {
    return _authorModel.default;
  }
});
Object.defineProperty(exports, "Polls", {
  enumerable: true,
  get: function () {
    return _pollModel.default;
  }
});
Object.defineProperty(exports, "Tags", {
  enumerable: true,
  get: function () {
    return _tagModel.default;
  }
});

var _userModel = _interopRequireDefault(require("./user-model"));

var _articleModel = _interopRequireDefault(require("./article-model"));

var _authorModel = _interopRequireDefault(require("./author-model"));

var _pollModel = _interopRequireDefault(require("./poll-model"));

var _tagModel = _interopRequireDefault(require("./tag-model"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }