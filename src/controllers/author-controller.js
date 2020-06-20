import axios from 'axios';
import { Authors } from '../models';
import fetchURL from './fetchURL';
import userController from './user-controller';

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
    author,
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
      user: userController.removeDocPassword(user),
      author,
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
      return !user._id.equals(id);
    });
  }
  // wooo parallel saving
  await Promise.all([
    await user.save(),
    await author.save(),
  ]);
  return {
    user: userController.removeDocPassword(user),
    author,
    isFollowing,
  };
}

export default { searchByName, getProfileBySlug, toggleFollowingBySlug };
