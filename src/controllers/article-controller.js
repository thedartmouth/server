import { Articles } from '../models';

async function fetchArticles() {
  return Articles.find({});
}

// createArticle(ceo_article) from the frontend
async function createArticle(ceoArticle) {
  // what's the data type of ceo_article? is it the exact same as our article model?
  // is it just an article CEOID?
  const newArticle = new Articles({
    // populate the document with the appropriate data
    // probably best to do this after we change the Articles schema
    views: 0,
  });
  return newArticle.save();
}

async function incrementViewCount(articleID) {
  const foundArticle = await Articles.findById(articleID);
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
