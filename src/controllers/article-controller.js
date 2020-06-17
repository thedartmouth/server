import { Articles, Users } from '../models';

function fetchArticles() {
  // Articles.find({}).then((foundResult) => {
  //   console.log(foundResult);
  //   return foundResult;
  // });
  return Articles.find({});
}

// createArticle(ceo_article) from the frontend

function incrementViewCount(articleID) {
  Articles.findById(articleID).then((foundArticle) => {
    foundArticle.views += 1.0;
    foundArticle.save().then((savedArticle) => {
      return savedArticle;
    });
  });
}

// elorm
function bookmarkArticle(userID, articleID) {
  Users.findById(userID).then((user) => {
    user.bookmarkArticle.push(articleID);
    user.save().then((updatedUser) => {
      return updatedUser;
    });
  });
}

export default { fetchArticles, incrementViewCount, bookmarkArticle };
