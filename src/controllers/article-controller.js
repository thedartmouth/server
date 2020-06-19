import { Articles } from '../models';

async function fetchArticles() {
  return Articles.find({});
}

// takes an article object (with format = JSON api's format), saves in db
async function createArticle(article) {
  const newArticle = new Articles({
    _id: article.slug,
    views: 0,
  });
  return newArticle.save();
}

async function incrementViewCount(articleSlug) {
  const foundArticle = await Articles.findById(articleSlug);
  foundArticle.views += 1;
  return foundArticle.save();
}

// elorm
function bookmarkArticle(userID, articleID) {
  // await Users.find(userid)
  // user.bookmarkArticle.push(article)
}

export default {
  fetchArticles, createArticle, incrementViewCount,
};
