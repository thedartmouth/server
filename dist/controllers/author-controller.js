"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(require("axios"));

var _models = require("../models");

var _fetchURL = _interopRequireDefault(require("./fetchURL"));

var _userController = _interopRequireDefault(require("./user-controller"));

var _cleanArticles = _interopRequireDefault(require("./cleanArticles"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// takes a potential name and returns the author document it corresponds to
async function searchByName(authorName) {
  // first look for an exact match in the db, if found return
  const author = await _models.Authors.findOne().byName(authorName);
  if (author) return author; // then look for it in JSON API, if not found return error

  const data = await _axios.default.get(_fetchURL.default.AuthorsLite + authorName);
  if (!data || !data.data || !data.data.total) return null; // try to look for exact match if possible in items[0]

  const exactMatch = data.data.items[0].authors.find(potentialAuthor => {
    return potentialAuthor.name === authorName;
  });
  let foundSlug;
  let foundName;

  if (exactMatch) {
    foundSlug = exactMatch.slug;
    foundName = exactMatch.name;
  } else {
    // check to see if the returned value was actually in db now that it's a legit slug
    foundSlug = data.data.items[0].authors[0].slug;
    foundName = data.data.items[0].authors[0].name;
  }

  const fixedAuthor = await _models.Authors.findById(foundSlug);
  if (fixedAuthor) return fixedAuthor; // now we're sure the author is entirely new; add to db

  const newAuthor = new _models.Authors({
    _id: foundSlug,
    name: foundName
  });
  await newAuthor.save();
  return newAuthor;
}

async function getAuthorDocBySlug(slug) {
  // search the db, if not found, look up the slug
  let author = await _models.Authors.findById(slug);

  if (!author) {
    const authorfetch = await _axios.default.get(`${_fetchURL.default.AuthorSlug + slug}.json`);
    if (!authorfetch || !authorfetch.data) return null;
    author = new _models.Authors({
      _id: slug,
      name: authorfetch.data.author.name
    });
    await author.save();
  }

  return author;
} // gets an author's "profile" given their slug


async function getProfileBySlug(slug) {
  const author = await getAuthorDocBySlug(slug);
  if (!author) return null; // ping advanced search for their articles (slug.json only gives 10 results)

  const data = await _axios.default.get(_fetchURL.default.Authors + author.name);
  if (!data || !data.data || !data.data.total) return null; // return summary data and articles

  return {
    author,
    totalArticles: data.data.total,
    totalHits: data.data.items.reduce((total, article) => {
      return total + parseInt(article.hits, 10);
    }, 0),
    articles: (0, _cleanArticles.default)(data.data.items) // below idea would require a bit of author model redesign
    // totalViews: author.totalViews,

  };
} // toggles whether or not we're following an author


async function toggleFollowingBySlug(slug, user, isFollowing) {
  const author = await getAuthorDocBySlug(slug);
  if (!author) return null; // if things are consistent, return

  if (user.followedAuthors.includes(author._id) === isFollowing && author.followers.includes(user._id) === isFollowing) {
    return {
      user: _userController.default.removeDocPassword(user),
      author,
      isFollowing
    };
  } // push to arrays if we want to follow


  if (isFollowing) {
    user.followedAuthors.push(author._id);
    author.followers.push(user._id);
  } else {
    // use filter to avoid state mutation that splice would do
    user.followedAuthors = user.followedAuthors.filter(id => {
      return id !== author._id;
    });
    author.followers = author.followers.filter(id => {
      return !user._id.equals(id);
    });
  } // wooo parallel saving


  await Promise.all([await user.save(), await author.save()]);
  return {
    user: _userController.default.removeDocPassword(user),
    author,
    isFollowing
  };
}

var _default = {
  searchByName,
  getProfileBySlug,
  toggleFollowingBySlug
};
exports.default = _default;