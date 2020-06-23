/* eslint-disable no-unused-vars */
import { Articles, Users, Tags } from '../models';

// grabs all articles
async function fetchArticles() {
  // Articles.find({}).then((foundResult) => {
  //   console.log(foundResult);
  //   return foundResult;
  // });
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

// bookmarks an article if it's not been already bookmarked, else unbookmarks it
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

// tags an Article if it hasn't been already tagged, else removes tag
async function tagArticle(userID, tagID) {
  try {
    const user = await Users.findById(userID);
    const tag = await Tags.findById(tagID);

    const tagIndex = user.followedTags.indexOf(tagID);
    const userIndex = tag.followers.indexOf(userID);

    if (tagIndex > -1 || userIndex > -1) {
      // article is already tagged, remove tag
      user.followedTags.splice(tagIndex, 1);
      tag.followedTags.splice(userIndex, 1);
    } else {
      user.followedTags.push(tagID);
      tag.followers.push(userID);
    }
    const savedUser = await user.save();
    const savedTag = await tag.save();

    return { user: savedUser, article: savedTag };
  } catch (err) {
    return err.value === userID
      ? { message: 'Invalid userID', error: err }
      : { message: 'Invalid tagID' };
  }
}

export default {
  fetchArticles, fetchArticleBySlug, createArticle, incrementViewCount, bookmarkArticle,
};
