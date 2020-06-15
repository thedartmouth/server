import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema({
  CEOID: { type: String }, // references SNWorks, is not _id
  webURL: { type: String },
  category: [{ type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
  headline: { type: String },
  imageURL: { type: String },
  content: { type: String },
  associatedPolls: [
    { type: Schema.Types.ObjectId, ref: 'Poll' },
  ],
  createdAt: { type: Date },
  modifiedAt: { type: Date },
  publishedAt: { type: Date },
  views: { type: Number },
  // would prefer this to either be indexed or mapped but unsure how to do that
  viewedUsers: [
    {
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      viewCount: { type: Number },
    },
  ],
  authors: [
    { type: Schema.Types.ObjectId, ref: 'Author' },
  ],
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
