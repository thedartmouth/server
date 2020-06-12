import { Articles, Users } from '../models';

function fetchArticles() {
  Articles.find({}).then((foundResult) => {
    return foundResult;
  });
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
  // await Users.find(userid)
  // user.bookmarkArticle.push(article)
}

export default { fetchArticles, incrementViewCount };
