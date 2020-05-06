import mongoose, { Schema } from 'mongoose';

const ListingSchema = new Schema({
  title: { type: String, default: 'Untitled' },
  organization: { type: Schema.Types.ObjectId, ref: 'User' },
  location: { type: String, default: '' },
  description: { type: String, default: '' },
  responsibilities: [{ type: String, default: '' }],
  focus_area: [{ type: String, default: '' }],

  contact_url: { type: String, default: '' },
  contact_phone: { type: String, default: '' },
  contact_email: { type: String, default: '' },

  time_commitment: { type: String, default: '' },
  age_restrictions: { type: String, default: 'None' },
  education_requirement: { type: String, default: 'None' },

  post_active: { type: Boolean, default: true },
  post_deleted: { type: Boolean, default: false },

  created_date: { type: Date, default: Date.now() },
  start_date: { type: Date, default: null },
  end_date: { type: Date, default: null },
  expiration_date: { type: Date, default: null },
});

const ListingModel = mongoose.model('Listing', ListingSchema);

export default ListingModel;
