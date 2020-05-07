// eslint-disable-next-line import/no-cycle
import { userController } from '.';

function populateAndRedact(listing) {
  // Update organization to remove irrelevant information
  listing = listing.toObject();
  if (listing.organization) {
    listing.organization = userController.getListingUser(listing.organization);
  }
  return listing;
}

function populateAndRedactMultiple(listings) {
  // Update organizations to remove irrelevant information
  const updatedListings = [];
  listings.forEach((l) => {
    l = l.toObject();
    if (l.organization) {
      l.organization = userController.getListingUser(l.organization);
    }
    updatedListings.push(l);
  });

  return updatedListings;
}

const listingController = { populateAndRedact, populateAndRedactMultiple };

export default listingController;
