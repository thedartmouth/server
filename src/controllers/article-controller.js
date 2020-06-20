import { Articles } from '../models';

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
    views: 0,
  });
  return newArticle;
}

// wrapper around createArticle that also saves it in db
async function createAndSaveArticle(article) {
  const newArticle = createArticle(article);
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

// when client reads an article, they send the api a call
// including the article, so we can catalog its existence for
// view count/bookmarking/sharing purposes
async function processReadArticle(article, user) {
  // looks for article; if not found, make it
  let dbArticle = await Articles.findById(article.slug);
  if (!dbArticle) dbArticle = createArticle(article);
  // view count goes up
  dbArticle.views += 1;
  if (user) {
    let viewedUser = dbArticle.viewedUsers.find((item) => {
      return user._id.equals(item.user);
    });
    if (!viewedUser) {
      viewedUser = {
        user: user._id,
        viewCount: 1,
      };
      dbArticle.viewedUsers.push(viewedUser);
    }
    viewedUser.viewCount += 1;
    console.log(viewedUser);
    dbArticle.markModified('viewedUsers');
  }
  // here is where we can implement user stuff
  await dbArticle.save();
  return dbArticle;
}

// elorm
function bookmarkArticle(userID, articleID) {
  // await Users.find(userid)
  // user.bookmarkArticle.push(article)
}

export default {
  fetchArticles, fetchArticleBySlug, createAndSaveArticle, incrementViewCount, bookmarkArticle, processReadArticle,
};
