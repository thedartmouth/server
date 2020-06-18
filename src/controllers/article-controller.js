/* eslint-disable no-unused-vars */
import { Articles, Users } from '../models';

async function fetchArticles() {
  // Articles.find({}).then((foundResult) => {
  //   console.log(foundResult);
  //   return foundResult;
  // });
  return Articles.find({});
}

// takes an article object (with format = JSON api's format), saves in db
async function createArticle(article) {
  const newArticle = new Articles({
    _id: article.uuid,
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


async function bookmarkArticle(userID, articleID) {
  try {
    const user = await Users.findById(userID);
    const article = await Articles.findById(articleID);

    const articleIndex = user.bookmarkedArticles.indexOf(articleID);
    const userIndex = article.bookMarkedUsers.indexOf(userID);

    if (articleIndex > -1 || userIndex > -1) {
      // article is already bookmarked, remove bookmark
      user.bookmarkedArticles.splice(articleIndex, 1);
      article.bookMarkedUsers.splice(userIndex, 1);
    } else {
      user.bookmarkedArticles.push(articleID);
      article.bookMarkedUsers.push(userID);
    }
    const savedUser = await user.save();
    const savedArticle = await article.save();

    return { user: savedUser, article: savedArticle };
  } catch (err) {
    return err.value === userID
      ? { message: 'Invalid userID', error: err }
      : { message: 'Invalid articleID' };
  }
}

export default {
  fetchArticles, incrementViewCount, bookmarkArticle, createArticle,
};
