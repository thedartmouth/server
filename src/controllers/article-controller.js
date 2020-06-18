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


function bookmarkArticle(userID, articleID) {
  Users.findById(userID).then((user) => {
    user.bookmarkArticle.push(articleID);
    user.save().then((updatedUser) => {
      return updatedUser;
    });
  });
}

export default { fetchArticles, incrementViewCount, bookmarkArticle };
