import { Articles } from '../models';

// grabs all articles
async function fetchArticles() {
  return Articles.find({});
}

// grabs an article by its slug
async function fetchArticleBySlug(articleSlug) {
  return Articles.findbyId(articleSlug);
}

// takes an article object (with format = JSON api's format), saves in db
// returns the new article in case we want to use it later
async function createArticle(article) {
  const newArticle = new Articles({
    _id: article.slug,
    uuid: article.uuid,
    views: 0,
  });
  await newArticle.save();
  return newArticle;
}

// gets an article, increments its view count, and returns updated article
async function incrementViewCount(articleSlug) {
  const foundArticle = await Articles.findById(articleSlug);
  foundArticle.views += 1;
  await foundArticle.save();
  return foundArticle;
}

// elorm
function bookmarkArticle(userID, articleID) {
  // await Users.find(userid)
  // user.bookmarkArticle.push(article)
}

export default {
  fetchArticles, fetchArticleBySlug, createArticle, incrementViewCount, bookmarkArticle,
};
