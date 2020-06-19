import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  _id: { type: String },
  followers: [
    { type: Schema.Types.ObjectId, ref: 'User' },
  ],
});

const TagModel = mongoose.model('Tag', TagSchema);

export default TagModel;
