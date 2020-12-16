"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
const fetchURL = {
  Authors: 'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&au=',
  AuthorsLite: 'https://www.thedartmouth.com/search.json?a=1&per_page=1&ty=article&au=',
  AuthorSlug: 'https://www.thedartmouth.com/staff/',
  // remember to append .json every time
  Tags: 'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&tg=',
  Keywords: 'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&s=',
  Slug: 'https://www.thedartmouth.com/article/' // remember to append .json every time

};
var _default = fetchURL;
exports.default = _default;