"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

var uuid = _interopRequireWildcard(require("uuid"));

var _controllers = require("../controllers");

var _auth = require("../modules/auth");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = () => describe('The authentication middleware', () => {
  let user;
  beforeAll(async done => {
    user = {
      email: `${uuid.v4()}@gmail.com`,
      password: 'good_password'
    };
    user.id = await _controllers.userController.createUser(user);
    user.token = (0, _auth.generateToken)(user.id);
    done();
  });
  describe('for {requireToken}', () => {
    test('prohibits access without token', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get('/require-auth');
      expect(res.statusCode).toBe(401);
    });
    test('permits access with token', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get('/require-auth').auth(user.token, {
        type: 'bearer'
      });
      expect(res.statusCode).toBe(200);
    });
    test('permits access as admin', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get('/require-auth').set('API_KEY', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
    });
  });
  describe('for {requireToken} with {admin}', () => {
    test('prohibits non-admin access without token', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get('/require-auth-admin/');
      expect(res.statusCode).toBe(401);
    });
    test('prohibits non-admin access with token', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get('/require-auth-admin/').auth(user.token, {
        type: 'bearer'
      });
      expect(res.statusCode).toBe(401);
    });
    test('permits access as admin', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get('/require-auth-admin/').auth(user.token, {
        type: 'bearer'
      }).set('API_KEY', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
    });
  });
  describe('for {requireSelf}', () => {
    test('prohibits access without token matching self', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get(`/require-auth-self/${uuid.v4()}`);
      expect(res.statusCode).toBe(401);
    });
    test('permits access with token matching self', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get(`/require-auth-self/${user.id}`).auth(user.token, {
        type: 'bearer'
      });
      expect(res.statusCode).toBe(200);
    });
    test('permits access access as admin', async () => {
      expect.assertions(1);
      const res = await (0, _supertest.default)(_app.default).get(`/require-auth-self/${uuid.v4()}`).set('API_KEY', process.env.API_KEY);
      expect(res.statusCode).toBe(200);
    });
  });
  afterAll(async done => {
    await _controllers.userController.deleteUser(user.id);
    done();
  });
});

exports.default = _default;