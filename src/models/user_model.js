import mongoose, { Schema } from 'mongoose';

const UserSchema = new Schema({
  _id: { type: String, unique: true }, // taken from firebase uid
  email: String,
  first_name: String,
  last_name: String,
  phone_number: String,
  zip_code: String,
  date_account_created: Date,
  stripe_id: String,
  admin_user: Boolean,
  push_notification_registration_tokens: [],
  has_seen_welcome_popup: Boolean,
}, { _id: false, minimize: false });

UserSchema.set('toJSON', {
  virtuals: true,
});

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
