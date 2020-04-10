import mongoose, { Schema } from 'mongoose';

const ResourceSchema = new Schema({
  _id: { type: String, unique: true }, // taken from firebase uid
  element1: String,
  date_resource_created: Date,
  stripe_id: String,
}, { _id: false, minimize: false });

ResourceSchema.set('toJSON', {
  virtuals: true,
});

const ResourceModel = mongoose.model('User', ResourceSchema);

export default ResourceModel;
