import express from 'express';

import { Listings } from '../models';
import { requireAuth, requireAdmin } from '../authentication';

const router = express();

// find and return all listings
router.route('/')

  // Get all listings
  .get(requireAuth, (req, res) => {
    console.log('user', req.user);
    Listings.find({}).populate('organization').then((listings) => {
      return res.json(listings);
    }).catch((error) => {
      return res.status(500).json(error);
    });
  })

  // Create new listing (SECURE)
  .post(requireAuth, (req, res) => {
    const listing = new Listings();

    Object.keys(req.body).forEach(([key, value]) => {
      listing[key] = value;
    });

    // listing.title = req.body.title;
    // listing.description = req.body.description;
    // listing.date_account_created = Date.now();

    listing.save()
      .then((savedListing) => {
        return res.json(savedListing);
      }).catch((error) => {
        return res.status(500).json(error);
      });
  })

  // Delete all listings (SECURE, TESTING ONLY)
  .delete(requireAuth, (req, res) => {
    Listings.deleteMany({ })
      .then(() => {
        return res.json({ message: 'Successfully deleted all listings.' });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  });

router.route('/:id')

  // Get listing by id
  .get((req, res) => {
    Listings.findById(req.params.id)
      .then((listing) => {
        return res.json(listing);
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
    Listings.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // Fetch listing object and send
        Listings.findById(req.params.id)
          .then((listing) => {
            return res.json(listing);
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
    Listings.deleteOne({ _id: req.params.id })
      .then(() => {
        return res.json({ message: `Listing with id: ${req.params.id} was successfully deleted` });
      })
      .catch((error) => {
        return res.json(error);
      });
  });

export default router;
