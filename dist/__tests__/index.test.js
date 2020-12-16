"use strict";

var _dotenv = _interopRequireDefault(require("dotenv"));

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

var _auth = _interopRequireDefault(require("./auth.test"));

var _user = _interopRequireDefault(require("./user.test"));

var _article = _interopRequireDefault(require("./article.test"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_dotenv.default.config();

describe('The Express app', () => {
  test('starts', async () => {
    expect.assertions(2);
    const res = await (0, _supertest.default)(_app.default).get('/');
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('Welcome!');
  });
});
(0, _auth.default)();
(0, _user.default)();
(0, _article.default)();