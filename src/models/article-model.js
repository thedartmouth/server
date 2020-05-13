import mongoose, { Schema } from 'mongoose';

const ArticleSchema = new Schema({
  ceo_id: { type: String },
  web_url: {type: String},
  category: [{type: Schema.Types.ObjectId, ref: 'Category' }],
  tags: [{type: Schema.Types.ObjectId, ref: 'Tag' }],
  headline: {type: String},
  image_url: {type: String},
  content: { type: String },
  associated_polls: [
    {type: Schema.Types.ObjectId, ref: 'Poll' }
  ],
  created_at: {type: Date},
  modified_at: {type: Date},
  published_at: {type: Date},
  views: {type: Number},
  authors: [
    {type: Schema.Types.ObjectId, ref: 'Author' }
  ],
});

const ArticleModel = mongoose.model('Article', ArticleSchema);

export default ArticleModel;
