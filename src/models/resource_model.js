import mongoose, { Schema } from 'mongoose';

const ResourceSchema = new Schema({
  title: String,
  description: String,
  date_resource_created: Date,
});

const ResourceModel = mongoose.model('Resource', ResourceSchema);

export default ResourceModel;
