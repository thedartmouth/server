"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

var uuid = _interopRequireWildcard(require("uuid"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = '/users';

var _default = () => describe('The user endpoint', () => {
  const user = {
    name: {
      first: 'Test',
      last: 'User'
    },
    email: `${uuid.v4()}@email.com`,
    password: 'good_password'
  };
  describe('creates a new user', () => {
    test('successfully', async () => {
      expect.assertions(4);
      const createRes = await (0, _supertest.default)(_app.default).post(path).send(user).set('Accept', 'application/json');
      expect(createRes.statusCode).toBe(200);
      expect(uuid.validate(createRes.body.userId)).toBe(true);
      user.id = createRes.body.userId;
      const getRes = await (0, _supertest.default)(_app.default).get(`${path}/${createRes.body.userId}`).set('API_KEY', process.env.API_KEY);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toEqual({
        name: user.name,
        email: user.email,
        reads: 0
      });
    });
  });
  describe('prohibits duplicate emails', () => {
    test('successfully', async () => {
      expect.assertions(1);
      const createRes = await (0, _supertest.default)(_app.default).post(path).send(user).set('Accept', 'application/json');
      expect(createRes.statusCode).toBe(500);
    });
  });
  describe('authenticates with email and password', () => {
    test('successfully', async () => {
      expect.assertions(3);
      const getRes = await (0, _supertest.default)(_app.default).post(`${path}/auth`).send({
        email: user.email,
        password: user.password
      }).set('Accept', 'application/json');
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toHaveProperty('token');
      expect(getRes.body?.userId).toBe(user.id);
      user.token = getRes.body.token;
    });
    test('prohibits access for valid email but invalid password', async () => {
      expect.assertions(2);
      const getRes = await (0, _supertest.default)(_app.default).post(`${path}/auth`).send({
        email: user.email,
        password: uuid.v4()
      }).set('Accept', 'application/json');
      expect(getRes.statusCode).toBe(401);
      expect(getRes.text).toBe('invalid credentials');
    });
    test('prohibits access for invalid email but valid password', async () => {
      expect.assertions(2);
      const getRes = await (0, _supertest.default)(_app.default).post(`${path}/auth`).send({
        email: uuid.v4(),
        password: user.password
      }).set('Accept', 'application/json');
      expect(getRes.statusCode).toBe(401);
      expect(getRes.text).toBe('invalid credentials');
    });
  });
  describe('updates a user', () => {
    test('successfully', async () => {
      expect.assertions(5);
      const updatedUser = {
        id: 'cannot_set',
        name: {
          first: 'Test_updated',
          last: 'User_updated'
        },
        email: `${uuid.v4()}@email.com`,
        password: 'good_password_updated'
      };
      const updateRes = await (0, _supertest.default)(_app.default).put(`${path}/${user.id}`).send({
        id: updatedUser.id,
        firstName: updatedUser.name.first,
        lastName: updatedUser.name.last,
        email: updatedUser.email,
        password: updatedUser.password
      }).set('Accept', 'application/json').set('API_KEY', process.env.API_KEY);
      expect(updateRes.statusCode).toBe(200);
      const authRes = await (0, _supertest.default)(_app.default).post(`${path}/auth`).send({
        email: updatedUser.email,
        password: updatedUser.password
      }).set('Accept', 'application/json');
      expect(authRes.statusCode).toBe(200);
      expect(authRes.body?.userId).toBe(user.id);
      const getRes = await (0, _supertest.default)(_app.default).get(`${path}/${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toEqual({
        name: updatedUser.name,
        email: updatedUser.email,
        reads: 0
      });
    });
  });
  describe('deletes a user', () => {
    test('successfully', async () => {
      expect.assertions(1);
      const getRes = await (0, _supertest.default)(_app.default).delete(`${path}/${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getRes.statusCode).toBe(200);
    });
  });
});

exports.default = _default;