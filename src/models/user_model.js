import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  email: String,
  first_name: String,
  last_name: String,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
