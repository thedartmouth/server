"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressAsyncHandler = _interopRequireDefault(require("express-async-handler"));

var _auth = require("../modules/auth");

var _controllers = require("../controllers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const articleRouter = (0, _express.default)();
articleRouter.route('/reads').get((0, _auth.requireToken)({}), (0, _expressAsyncHandler.default)(async (req, res) => {
  await _controllers.userController.validateUserExistence(req.body.userId)(res);
  (0, _auth.requireSelf)(req.body.userId, req)(res);
  res.json(await _controllers.articleController.getReadArticles(req.body.userId));
})).post((0, _auth.requireToken)({
  optional: true
}), (0, _expressAsyncHandler.default)(async (req, res) => {
  if (!req.body.articleSlug) {
    res.status(400).send('missing {articleSlug}');
  } else {
    if (req.body.userId) {
      await _controllers.userController.validateUserExistence(req.body.userId)(res);
      (0, _auth.requireSelf)(req.body.userId, req)(res);
    }

    res.json(await _controllers.articleController.readArticle(req.body.articleSlug, req.body.userId));
  }
}));
articleRouter.route('/bookmarks/:userId').get((0, _auth.requireToken)({}), (0, _expressAsyncHandler.default)(async (req, res) => {
  await _controllers.userController.validateUserExistence(req.params.userId)(res);
  (0, _auth.requireSelf)(req.params.userId, req)(res);
  res.json(await _controllers.articleController.getBookmarkedArticles(req.params.userId));
})).post((0, _auth.requireToken)({}), (0, _expressAsyncHandler.default)(async (req, res) => {
  if (!req.body?.articleSlug) {
    res.status(400).send('missing {articleSlug}');
    return;
  }

  await _controllers.userController.validateUserExistence(req.params.userId)(res);
  (0, _auth.requireSelf)(req.params.userId, req)(res);
  const outcome = await _controllers.articleController.bookmarkArticle(req.body.articleSlug, req.params.userId);
  res.sendStatus(outcome === 'deleted' ? 410 : 200);
}));
articleRouter.route('/share').post((0, _expressAsyncHandler.default)(async (req, res) => {
  if (!req.body?.article) {
    res.status(400).send('missing article data');
    return;
  }

  res.json(await _controllers.articleController.shareArticle(req.body.article, req.user));
}));
articleRouter.route('/:slug').get((0, _auth.requireToken)({
  optional: true
}), (0, _expressAsyncHandler.default)(async (req, res) => {
  if (req.query.for) {
    await _controllers.userController.validateUserExistence(req.query.for)(res);
    (0, _auth.requireSelf)(req.query.for, req)(res);
  }

  res.json(await _controllers.articleController.fetchMetaArticle(req.params.slug, req.query.for));
}));
var _default = articleRouter;
exports.default = _default;