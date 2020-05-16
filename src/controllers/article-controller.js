import { Articles } from '../models';

function fetchArticles() {
  Articles.find({}).then((foundResult) => {
    return foundResult;
  });
}

function incrementViewCount(articleID) {
  Articles.findById(articleID).then((foundArticle) => {
    foundArticle.views += 1.0;
    foundArticle.save().then((savedArticle) => {
      return savedArticle;
    });
  });
}

export { fetchArticles, incrementViewCount };
