import mongoose, { Schema } from 'mongoose';

const TagSchema = new Schema({
  name: { type: String },
  interested_users: [
    { type: Schema.Types.ObjectId, ref: 'User' },
  ],
});

const TagModel = mongoose.model('Tag', TagSchema);

export default TagModel;
