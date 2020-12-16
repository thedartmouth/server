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

const userRouter = (0, _express.default)();
userRouter.route('/').post((0, _expressAsyncHandler.default)(async (req, res) => {
  if (req.body.name?.hasOwnProperty('first') && req.body.name?.hasOwnProperty('last') && req.body.hasOwnProperty('email') && req.body.hasOwnProperty('password')) {
    res.json(await _controllers.userController.createUser(req.body));
  } else {
    res.status(400).send('missing user data');
  }
}));
userRouter.route('/auth').post((0, _expressAsyncHandler.default)(async (req, res) => {
  if (!req.body.email || !req.body.password) {
    res.status(400).send('bad {email} and {password} format');
    return;
  }

  res.json(await _controllers.userController.generateTokenForUser(req.body.email, req.body.password));
}));
userRouter.route('/:userId').get((0, _expressAsyncHandler.default)(async (req, res) => {
  await _controllers.userController.validateUserExistence(req.params.userId)(res);
  (0, _auth.requireSelf)(req.body.userId, req)(res);
  res.json(await _controllers.userController.getBasicUserData(req.params.userId));
})).put((0, _auth.requireToken)({}), (0, _expressAsyncHandler.default)(async (req, res) => {
  await _controllers.userController.validateUserExistence(req.params.userId)(res);
  (0, _auth.requireSelf)(req.body.userId, req)(res);
  res.json(await _controllers.userController.updateBasicUserData(req.params.userId, req.body));
})).delete((0, _auth.requireToken)({}), (0, _expressAsyncHandler.default)(async (req, res) => {
  await _controllers.userController.validateUserExistence(req.params.userId)(res);
  (0, _auth.requireSelf)(req.body.userId, req)(res);
  await _controllers.userController.deleteUser(req.params.userId);
  res.sendStatus(200);
}));
var _default = userRouter;
exports.default = _default;