"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

var _auth = require("../modules/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const tagRouter = (0, _express.default)();
/*
 * PUT /tags/:userID/:tagID"
 * Allows user to follow or unfollow an article tag
 * returns updated user and tag
 */

tagRouter.route('/:userID/:tagID').put(_auth.requireToken, async (req, res) => {
  res.send(await _controllers.tagController.tagArticle(req.params.userID, req.params.tagID));
});
var _default = tagRouter;
exports.default = _default;