import axios from 'axios';
import { Authors } from '../models';

const fetchURL = {
  Authors: 'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&au=',
  AuthorsLite: 'https://www.thedartmouth.com/search.json?a=1&per_page=1&ty=article&au=',
  Tags: 'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&tg=',
  Keywords: 'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&s=',
};

// takes a potential name and returns the author document it corresponds to
async function searchByName(authorName) {
  // first look for an exact match in the db, if found return
  const author = await Authors.findOne().byName(authorName);
  if (author) return author;
  // then look for it in JSON API, if not found return error
  const data = await axios.get(fetchURL.AuthorsLite + authorName);
  if (!data || !data.data || !data.data.total) return null;
  // check to see if the returned value was actually in db now that it's a legit slug
  const foundSlug = data.data.items[0].authors[0].slug;
  const foundName = data.data.items[0].authors[0].name;
  const fixedAuthor = await Authors.findById(foundSlug);
  if (fixedAuthor) return fixedAuthor;
  // now we're sure the author is entirely new; add to db
  const newAuthor = new Authors({
    _id: foundSlug,
    name: foundName,
  });
  await newAuthor.save();
  return newAuthor;
}

// gets an author's "profile" given their slug
async function getProfileBySlug(slug) {
  // search the db, if not found, we don't look for them at all
  const author = await Authors.findById(slug);
  if (!author) return null;
  // ping JSON API for their data
  const data = await axios.get(fetchURL.Authors + author.name);
  if (!data || !data.data || !data.data.total) return null;
  if (data.data.items[0].authors[0].slug !== slug) return null;
  // return summary data and articles; currently uses strange 'hits' parameter in API
  return {
    name: author.name,
    slug,
    numFollowers: author.followers.length,
    totalArticles: data.data.total,
    totalViews: data.data.items.reduce((total, article) => {
      return (total + parseInt(article.hits, 10));
    }, 0),
    articles: data.data.items,
  };
}

// toggles whether or not we're following an author
async function toggleFollowingBySlug(slug, user, isFollowing) {
  // lookup the author doc; if none found error
  const author = await Authors.findById(slug);
  if (!author) return null;
  // if things are consistent, return
  if (user.followedAuthors.includes(author._id) === isFollowing
    && author.followers.includes(user._id) === isFollowing) {
    return {
      slug,
      isFollowing,
    };
  }
  // push to arrays if we want to follow
  if (isFollowing) {
    user.followedAuthors.push(author._id);
    author.followers.push(user._id);
  } else {
    // use filter to avoid state mutation that splice would do
    user.followedAuthors = user.followedAuthors.filter((id) => {
      return id !== author._id;
    });
    author.followers = author.followers.filter((id) => {
      return id !== user._id;
    });
  }
  // wooo parallel saving
  await Promise.all([
    await user.save(),
    await author.save(),
  ]);
  return {
    slug,
    isFollowing,
  };
}

export default { searchByName, getProfileBySlug, toggleFollowingBySlug };

// below contains some deprecated code that we don't need but I'm going to put in history
// for this commit!

// function checkAuthorConsistent(articles) {
//   // console.log(articles[0])
//   return articles[0].authors.reduce((isConsistent, candidateAuthor) => {
//     // console.log(candidateAuthor.slug);
//     return isConsistent || articles.reduce((isAlwaysPresent, article) => {
//       return isAlwaysPresent && article.authors.reduce((hasAuthor, author) => {
//         // console.log(author.slug);
//         return hasAuthor || author.slug === candidateAuthor.slug;
//       }, false);
//     }, true);
//   }, false);
// }


// async function searchByName(authorName) {
//   let [author, data] = await Promise.all([
//     await Authors.findOne().byName(authorName),
//     await axios.get(fetchURL.Authors + authorName),
//   ]);
//   if (!data || !data.data || !data.data.total) {
//     return null;
//   }
//   // check if there's a consistent singular author
//   if (!checkAuthorConsistent(data.data.items)) {
//     // re-search by the first author's name
//     authorName = data.data.items[0].authors[0].name;
//     console.log(authorName);
//     [author, data] = await Promise.all([
//       await Authors.findOne().byName(authorName),
//       await axios.get(fetchURL.Authors + authorName),
//     ]);
//   }
//   if (!author) {
//     author = new Authors({
//       _id: data.data.items[0].authors[0].slug,
//       name: authorName
//     });
//     await author.save();
//   }
//   console.log(author);
//   return {
//     name: data.data.items[0].authors[0].name,
//     slug: data.data.items[0].authors[0].slug,
//     totalArticles: data.data.total,
//     totalViews: data.data.items.reduce((total, article) => {
//       return (total + parseInt(article.hits, 10));
//     }, 0),
//     articles: data.data.items,
//   };
// }
