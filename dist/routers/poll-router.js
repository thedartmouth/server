"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _models = require("../models");

var _controllers = require("../controllers");

var _auth = require("../modules/auth");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const pollRouter = (0, _express.default)();
pollRouter.route('/') // fetch all polls
.get((req, res) => {
  _controllers.pollController.fetchPolls().then(polls => {
    res.send(polls);
  });
}) // create poll
.post(_auth.requireToken, (0, _expressAsyncHandler.default)(async (req, res) => {
  res.send(await _controllers.pollController.createPoll(req.body.question, req.body.answers, req.body.associatedArticle));
})) // vote in poll; will display poll afterwards; removed requireToken for now
.put((0, _expressAsyncHandler.default)(async (req, res) => {
  res.send(await _controllers.pollController.answerPoll(req.body.pollID, req.body.userID, req.body.answerChoice));
})).delete(_auth.requireToken, (req, res) => {});
pollRouter.route('/fetchAnswered/:userID') // fetch all answered polls for user; removed requireToken for now
.get((0, _expressAsyncHandler.default)(async (req, res) => {
  _controllers.pollController.fetchAnsweredPolls(req.params.userID).then(polls => {
    res.send(polls);
  });
}));
pollRouter.route('/fetchUnanswered/:userID') // fetch all unanswered polls for user; removed requireToken for now
.get((req, res) => {
  _controllers.pollController.fetchUnansweredPolls(req.params.userID).then(polls => {
    res.send(polls);
  });
});
pollRouter.route('/:id').get(_auth.requireToken, (0, _expressAsyncHandler.default)(async (req, res) => {
  res.send(await _models.Polls.findById(req.params.id).populate('associatedArticle'));
})).delete(_auth.requireToken, (req, res) => {});
var _default = pollRouter;
exports.default = _default;