import { Articles } from '../models';

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

// bookmarkArticle()

export { fetchArticles, incrementViewCount };
