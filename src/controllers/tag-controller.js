import { Tags, Users } from '../models';


// tags an Article if it hasn't been tagged, else removes tag
async function tagArticle(userID, tagID) {
  try {
    const user = await Users.findById(userID);
    const tag = await Tags.findById(tagID);

    const tagIndex = user.followedTags.indexOf(tagID);
    const userIndex = tag.followers.indexOf(userID);

    if (tagIndex > -1 || userIndex > -1) {
      // article is already tagged, remove tag
      user.followedTags.splice(tagIndex, 1);
      tag.followedTags.splice(userIndex, 1);
    } else {
      user.followedTags.push(tagID);
      tag.followers.push(userID);
    }
    const savedUser = await user.save();
    const savedTag = await tag.save();

    return { user: savedUser, article: savedTag };
  } catch (err) {
    return err.value === userID
      ? { message: 'Invalid userID', error: err }
      : { message: 'Invalid tagID' };
  }
}

export default { tagArticle };
