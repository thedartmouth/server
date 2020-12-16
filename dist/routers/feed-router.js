"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _controllers = require("../controllers");

var _auth = require("../modules/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const feedRouter = (0, _express.default)();
/*
 * GET /feed/authors
 * grabs a chronological feed of all articles authored by following authors
 *
 * returns an array of JSON API article objects
 * WIP to be paginated/cached later
 */

feedRouter.route('/authors').get(_auth.requireToken, async (req, res) => {
  try {
    res.json(await _controllers.feedController.fetchFollowingFeed(req.user, 'Authors'));
  } catch (error) {
    console.log(error);
    res.status(500).send('error fetching author feed');
  }
}); // currently untested since tag following isn't implemented yet
// but logic works for authors so should work the same here

feedRouter.route('/tags').get(_auth.requireToken, async (req, res) => {
  try {
    res.json(await _controllers.feedController.fetchFollowingFeed(req.user, 'Tags'));
  } catch (error) {
    console.log(error);
    res.status(500).send('error fetching tags feed');
  }
});
var _default = feedRouter;
exports.default = _default;