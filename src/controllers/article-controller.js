/* eslint-disable no-unused-vars */
import { Articles, Users } from '../models';

async function fetchArticles() {
  // Articles.find({}).then((foundResult) => {
  //   console.log(foundResult);
  //   return foundResult;
  // });
  return Articles.find({});
}

// createArticle(ceo_article) from the frontend
async function createArticle(ceoArticle) {
  // what's the data type of ceo_article? is it the exact same as our article model?
  // is it just an article CEOID?
  const newArticle = new Articles({
    // populate the document with the appropriate data
    // probably best to do this after we change the Articles schema
    _id: ceoArticle,
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
