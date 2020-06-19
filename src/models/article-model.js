import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema({
  _id: { type: String }, // slug of the article
  associatedPolls: [
    { type: Schema.Types.ObjectId, ref: 'Poll' },
  ],
  views: { type: Number },
  // would prefer this to either be indexed or mapped but unsure how to do that
  viewedUsers: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      viewCount: { type: Number }, // maybe we could remove this if it's not necessary?
    },
  ],
  bookMarkedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // this.length = # bookmarks
  sharedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }], // may or may not need # shares per user
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
