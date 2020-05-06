import mongoose, { Schema } from 'mongoose';

const ListingSchema = new Schema({
  title: { type: String, default: 'Untitled' },
  description: { type: String, default: '' },
  value: { type: Number, default: null },
  date_listing_created: { type: Date, default: Date.now() }, // default JSON date format for JS: https://stackoverflow.com/a/15952652/10256611,
  child_listings: [{ type: Schema.Types.ObjectId, ref: 'SubListing' }],
});

const ListingModel = mongoose.model('Listing', ListingSchema);

export default ListingModel;
