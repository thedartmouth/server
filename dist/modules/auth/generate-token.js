"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tokenForUser;

var _jwtSimple = _interopRequireDefault(require("jwt-simple"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function tokenForUser(userId) {
  const timestamp = new Date().getTime();
  return _jwtSimple.default.encode({
    userId,
    timestamp: timestamp
  }, process.env.AUTH_SECRET);
}