import express from 'express';

import { Listings } from '../models';
import { listingController } from '../controllers';
import { requireAuth, requireAdmin } from '../authentication';

const router = express();

// find and return all listings
router.route('/')

  // Get all listings
  .get(requireAuth, (req, res) => {
    Listings.find({}).populate('organization').then((listings) => {
      return res.json(listingController.populateAndRedactMultiple(listings));
    }).catch((error) => {
      return res.status(500).json(error);
    });
  })

  // Create new listing (SECURE)
  .post(requireAuth, (req, res) => {
    const listing = new Listings();

    console.log('req.body', req.body);

    Object.keys(req.body).forEach((key) => {
      listing[key] = req.body[key];
    });

    listing.save().then((tempSavedListing) => {
      Listings.findById(tempSavedListing._id).populate('organization').then((savedListing) => {
        return res.json(listingController.populateAndRedact(savedListing));
      }).catch((error) => {
        return res.status(500).json(error);
      });
    }).catch((error) => {
      return res.status(500).json(error);
    });
  })

  // Delete all listings (SECURE, TESTING ONLY)
  .delete(requireAdmin, (req, res) => {
    Listings.deleteMany({ }).then(() => {
      return res.json({ message: 'Successfully deleted all listings.' });
    })
      .catch((error) => {
        return res.status(500).json(error);
      });
  });

router.route('/:id')

  // Get listing by id
  .get((req, res) => {
    Listings.findById(req.params.id).populate('organization').then((listing) => {
      return res.json(listingController.populateAndRedact(listing));
    })
      .catch((error) => {
        if (error.message && error.message.startsWith('Listing with id:')) {
          return res.status(404).json(error);
        } else {
          return res.status(500).json(error);
        }
      });
  })

  // Update listing by id (SECURE)
  .put(requireAuth, (req, res) => {
    Listings.updateOne({ _id: req.params.id }, req.body).then(() => {
      // Fetch listing object and send
      Listings.findById(req.params.id).populate('organization').then((listing) => {
        return res.json(listingController.populateAndRedact(listing));
      })
        .catch((error) => {
          if (error.message.startsWith('Listing with id:')) {
            return res.status(404).json({ message: error.message });
          } else {
            return res.status(500).json({ message: error.message });
          }
        });
    })
      .catch((error) => {
        return res.status(500).json(error);
      });
  })

  // Delete listing by id, SECURE
  .delete(requireAuth, (req, res) => {
    Listings.deleteOne({ _id: req.params.id }).then(() => {
      return res.json({ message: `Listing with id: ${req.params.id} was successfully deleted` });
    })
      .catch((error) => {
        return res.json(error);
      });
  });

export default router;
