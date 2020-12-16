"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _models = require("../models");

// helper function to create Tag model
function createTag(tagID) {
  const newTag = new _models.Tags({
    _id: tagID,
    followers: []
  });
  return newTag.save();
} // tags an Article if it hasn't been tagged, else removes tag


async function tagArticle(userID, tagID) {
  try {
    const user = await _models.Users.findById(userID);
    let tag = await _models.Tags.findById(tagID); // if the tag doesn't exist, create one

    if (tag === null && user !== null) {
      tag = await createTag(tagID);
    }

    const tagIndex = user.followedTags.indexOf(tagID);
    const userIndex = tag.followers.indexOf(userID);

    if (tagIndex > -1 || userIndex > -1) {
      // user already has this tag, remove tag
      user.followedTags.splice(tagIndex, 1);
      tag.followers.splice(userIndex, 1);
    } else {
      user.followedTags.push(tagID);
      tag.followers.push(userID);
    }

    const savedUser = await user.save();
    const savedTag = await tag.save();
    return {
      user: savedUser,
      tag: savedTag
    };
  } catch (err) {
    return err.value === userID ? {
      message: 'Invalid userID',
      error: err
    } : {
      message: 'Invalid tagID'
    };
  }
}

var _default = {
  tagArticle
};
exports.default = _default;