import mongoose, { Schema } from 'mongoose';

const CategorySchema = new Schema({
  name: {type: String},
  interested_users: [
    {type: Schema.Types.ObjectId, ref: 'User' },
  ],
});

const CategoryModel = mongoose.model('Tag', CategorySchema);

export default CategoryModel;
