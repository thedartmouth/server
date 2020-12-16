"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _app = _interopRequireDefault(require("../app"));

var _supertest = _interopRequireDefault(require("supertest"));

var uuid = _interopRequireWildcard(require("uuid"));

var _auth = require("../modules/auth");

var _controllers = require("../controllers");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const path = '/articles';

var _default = () => describe('The article endpoint', () => {
  let user;
  const article = {
    slug: uuid.v4(),
    reads: 0
  };
  beforeAll(async done => {
    user = {
      email: `${uuid.v4()}@gmail.com`,
      password: 'good_password'
    };
    user.id = await _controllers.userController.createUser(user);
    user.token = (0, _auth.generateToken)(user.id);
    done();
  });
  describe('creates a new article on read', () => {
    test('successfully', async () => {
      expect.assertions(3);
      const readRes = await (0, _supertest.default)(_app.default).post(`${path}/reads`).send({
        articleSlug: article.slug,
        userId: user.id
      }).set('API_KEY', process.env.API_KEY);
      expect(readRes.statusCode).toBe(200);
      article.reads += 1;
      const getRes = await (0, _supertest.default)(_app.default).get(`${path}/${article.slug}`).set('API_KEY', process.env.API_KEY);
      expect(getRes.statusCode).toBe(200);
      expect(getRes.body).toEqual({
        slug: article.slug,
        reads: article.reads,
        bookmarked: null,
        read: null
      });
    });
  });
  describe('increments read count', () => {
    beforeAll(async done => {
      await (0, _supertest.default)(_app.default).post(`${path}/reads`).send({
        articleSlug: article.slug,
        userId: user.id
      }).set('API_KEY', process.env.API_KEY);
      article.reads += 1;
      await (0, _supertest.default)(_app.default).post(`${path}/reads`).send({
        articleSlug: article.slug
      }).set('API_KEY', process.env.API_KEY);
      article.reads += 1;
      done();
    });
    test('successfully', async () => {
      expect.assertions(7);
      const getArticleRes = await (0, _supertest.default)(_app.default).get(`${path}/${article.slug}`).set('API_KEY', process.env.API_KEY);
      expect(getArticleRes.statusCode).toBe(200);
      expect(getArticleRes.body.reads).toBe(article.reads);
      const getUserRes = await (0, _supertest.default)(_app.default).get(`/users/${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getUserRes.statusCode).toBe(200);
      expect(getUserRes.body.reads).toBe(article.reads - 1);
      const getReadsRes = await (0, _supertest.default)(_app.default).get(`${path}/reads`).send({
        userId: user.id
      }).set('API_KEY', process.env.API_KEY);
      expect(getReadsRes.statusCode).toBe(200);
      expect(getReadsRes.body.map(article => article.slug)).toContain(article.slug);
      expect(getReadsRes.body.map(article => new Date(article.timestamp)).every((date, idx, timestamps) => {
        if (idx < timestamps.length - 1) {
          return date <= new Date(timestamps[idx + 1]);
        } else return true;
      })).toBe(true);
    });
  });
  describe('bookmarks an article', () => {
    test('successfully', async () => {
      expect.assertions(4);
      const bookmarkArticleRes = await (0, _supertest.default)(_app.default).post(`${path}/bookmarks/${user.id}`).send({
        articleSlug: article.slug
      }).set('API_KEY', process.env.API_KEY);
      expect(bookmarkArticleRes.statusCode).toBe(200);
      const getBookmarksRes = await (0, _supertest.default)(_app.default).get(`${path}/bookmarks/${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getBookmarksRes.statusCode).toBe(200);
      expect(getBookmarksRes.body.map(article => article.slug)).toContain(article.slug);
      expect(getBookmarksRes.body.map(article => new Date(article.timestamp)).every((date, idx, timestamps) => {
        if (idx < timestamps.length - 1) {
          return date <= new Date(timestamps[idx + 1]);
        } else return true;
      })).toBe(true);
    });
  });
  describe('unbookmarks an article', () => {
    let otherArticle = {
      slug: uuid.v4(),
      reads: 0
    };
    beforeAll(async done => {
      await _controllers.articleController.readArticle(otherArticle.slug);
      await (0, _supertest.default)(_app.default).post(`${path}/bookmarks/${user.id}`).send({
        articleSlug: otherArticle.slug
      }).set('API_KEY', process.env.API_KEY);
      done();
    });
    test('successfully', async () => {
      expect.assertions(1);
      const unbookmarkArticleRes = await (0, _supertest.default)(_app.default).post(`${path}/bookmarks/${user.id}`).send({
        articleSlug: otherArticle.slug
      }).set('API_KEY', process.env.API_KEY);
      expect(unbookmarkArticleRes.statusCode).toBe(410);
    });
    afterAll(async done => {
      await _controllers.articleController.deleteMetaArticle(otherArticle.slug);
      done();
    });
  });
  describe('returns reading and bookmarked data', () => {
    test('successfully', async () => {
      expect.assertions(3);
      const getArticleRes = await (0, _supertest.default)(_app.default).get(`${path}/${article.slug}?for=${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getArticleRes.statusCode).toBe(200);
      expect(getArticleRes.body.read).toBe(true);
      expect(getArticleRes.body.bookmarked).toBe(true);
    });
  });
  describe('deletes reads on article deletion', () => {
    test('successfully', async () => {
      expect.assertions(6);
      await _controllers.articleController.deleteMetaArticle(article.slug);
      const getUserRes = await (0, _supertest.default)(_app.default).get(`/users/${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getUserRes.statusCode).toBe(200);
      expect(getUserRes.body.reads).toBe(article.reads - 1);
      const getReadsRes = await (0, _supertest.default)(_app.default).get(`${path}/reads`).send({
        userId: user.id
      }).set('API_KEY', process.env.API_KEY);
      expect(getReadsRes.statusCode).toBe(200);
      expect(getReadsRes.body.map(article => article.slug)).toHaveLength(0);
      const getBookmarksRes = await (0, _supertest.default)(_app.default).get(`${path}/bookmarks/${user.id}`).set('API_KEY', process.env.API_KEY);
      expect(getBookmarksRes.statusCode).toBe(200);
      expect(getBookmarksRes.body.map(article => article.slug)).toHaveLength(0);
    });
  });
  afterAll(async done => {
    await _controllers.userController.deleteUser(user.id);
    done();
  });
});

exports.default = _default;