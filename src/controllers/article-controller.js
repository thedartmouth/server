/* eslint-disable no-unused-vars */
import { Articles, Users } from '../models';

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

// bookmarks an article if it's not been bookmarked, else unbookmarks it
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
  fetchArticles, fetchArticleBySlug, createArticle, incrementViewCount, bookmarkArticle,
};
