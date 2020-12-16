"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _bodyParser = _interopRequireDefault(require("body-parser"));

var _cors = _interopRequireDefault(require("cors"));

var _dotenv = _interopRequireDefault(require("dotenv"));

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _error = require("./modules/error");

var _auth = require("./modules/auth");

var _routers = require("./routers");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config(); // initialize


const app = (0, _express.default)(); // enable CORS

app.use((0, _cors.default)()); // configure logging

app.use((0, _morgan.default)('dev')); // configure data type

app.use(_bodyParser.default.urlencoded({
  extended: true
}));
app.use(_bodyParser.default.json()); // declare routers

app.use('/users', _routers.userRouter);
app.use('/articles', _routers.articleRouter);
app.use('/polls', _routers.pollRouter);
app.use('/feed', _routers.feedRouter);
app.use('/author', _routers.authorRouter);
app.use('/tags', _routers.tagRouter); // default index route

app.get('/', (req, res) => {
  res.send('Welcome!');
});
app.get('/require-auth', (0, _auth.requireToken)({}), (req, res) => {
  res.sendStatus(200);
});
app.get('/require-auth-self/:userId', (0, _auth.requireToken)({}), (req, res) => {
  (0, _auth.requireSelf)(req.params.userId, req)(res);
  res.sendStatus(200);
});
app.get('/require-auth-admin', (0, _auth.requireToken)({
  admin: true
}), (req, res) => {
  res.sendStatus(200);
}); // custom 404 middleware

app.use((req, res) => {
  res.status(404).json({
    message: "The route you've requested doesn't exist"
  });
});
app.use(_error.errorHandlerMiddleware);
var _default = app;
exports.default = _default;