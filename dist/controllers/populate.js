"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _models = require("../models");

var constants = _interopRequireWildcard(require("../constants"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Populates all possible first-layer fields of a Mongo Document.
 * @param {Document} document
 */
const populateAll = document => {
  return new Promise(resolve => {
    Promise.all(Object.values(document.schema.paths).map(path => {
      return new Promise(resolve => {
        if (path.instance === 'ObjectID' && path.path !== '_id') {
          resolve(path.path);
        } else if (path.instance === 'Array' && path.caster.instance === 'ObjectID') {
          resolve(path.caster.path);
        } else resolve('');
      });
    })).then(paths => {
      paths = paths.filter(path => {
        return path !== '';
      });
      document.populate(paths).execPopulate().then(populatedDocument => {
        resolve(populatedDocument);
      });
    });
  });
};

const testPopulateAll = () => {
  const mongooseOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    loggerLevel: 'error'
  };

  _mongoose.default.connect(constants.MONGODB_URI, mongooseOptions).then(() => {
    _mongoose.default.Promise = global.Promise; // configures mongoose to use ES6 Promises

    console.log('Connected to Database');

    _models.Articles.findById('5eaf8d1c7e000cec1c6598e1').then(foundArticle => {
      populateAll(foundArticle).then(populatedArticle => {}).catch(error => {
        return console.log(error);
      });
    });
  }).catch(err => {
    console.log('Not Connected to Database ERROR! ', err);
  });
};
/**
 * Only executes the testing of populateAll if this module was run independently.
 */


if (typeof require !== 'undefined' && require.main === module) {
  testPopulateAll();
}

var _default = populateAll;
exports.default = _default;