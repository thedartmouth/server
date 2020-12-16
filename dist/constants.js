"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UNPROTECTED_USER_FIELDS = exports.USER_STRING = exports.APP_URL = exports.SELF_URL = exports.MONGODB_URI = void 0;

var _package = _interopRequireDefault(require("../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const MONGODB_URI = process.env.MONGODB_URI || _package.default.localDatabaseURI;
exports.MONGODB_URI = MONGODB_URI;
const SELF_URL = process.env.NODE_ENV === 'development' ? `localhost:${9090}` : _package.default.productionURL;
exports.SELF_URL = SELF_URL;
const APP_URL = process.env.NODE_ENV === 'development' ? `localhost:${8080}` : _package.default.productionClientURL;
exports.APP_URL = APP_URL;
const USER_STRING = 'organization';
exports.USER_STRING = USER_STRING;
const UNPROTECTED_USER_FIELDS = [// Need to be verified, TODO
  // 'email',
  // 'password',
];
exports.UNPROTECTED_USER_FIELDS = UNPROTECTED_USER_FIELDS;