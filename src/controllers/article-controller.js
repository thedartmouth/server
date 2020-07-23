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

// takes an article object (with format = JSON api's format)
// creates and returns a new document of it
function createArticle(article) {
  const newArticle = new Articles({
    _id: article.slug,
    uuid: article.uuid,
  });
  return newArticle;
}

// wrapper around createArticle that also saves it in db
async function createAndSaveArticle(article) {
  const newArticle = createArticle(article);
  await newArticle.save();
  return newArticle;
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
// when client reads an article, they send the api a call
// including the article, so we can catalog its existence for
// view count/bookmarking/sharing purposes
async function processReadArticle(article, user) {
  // looks for article; if not found, make it
  let dbArticle = await Articles.findById(article.slug);
  if (!dbArticle) dbArticle = createArticle(article);
  if (user) {
    const viewedUser = dbArticle.viewedUsers.find((item) => {
      return user._id.equals(item);
    });
    if (!viewedUser) {
      dbArticle.viewedUsers.push(user._id);
    }
  }
  // here is where we can implement user stuff
  await dbArticle.save();
  return dbArticle;
}

// works the same way as processReadArticle
// finds an article and adds the user to the shared list
async function shareArticle(article, user) {
  const dbArticle = await Articles.findById(article.slug);
  if (user) {
    const sharedUser = dbArticle.sharedUsers.find((item) => {
      return user._id.equals(item);
    });
    if (!sharedUser) {
      dbArticle.sharedUsers.push(user._id);
    }
  }
  await dbArticle.save();
  return dbArticle;
}

export default {
  fetchArticles, fetchArticleBySlug, createAndSaveArticle, bookmarkArticle, processReadArticle, shareArticle,
};
