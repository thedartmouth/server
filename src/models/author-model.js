import mongoose, { Schema } from 'mongoose';

const AuthorSchema = new Schema({
  name: { type: String },
  followers: [
    { type: Schema.Types.ObjectId, ref: 'User' },
  ],
});

const AuthorModel = mongoose.model('Author', AuthorSchema);

export default AuthorModel;
