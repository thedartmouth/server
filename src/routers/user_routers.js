import express from 'express';

import { Users } from '../models';
import { requireAuth, requireAdmin } from '../authentication';
import { userController } from '../controllers';

import * as constants from '../constants';

const router = express();

// find and return all users
router.route('/')

  // Get all users
  .get(requireAdmin, (req, res) => {
    Users.find({}).then((users) => {
      Promise.all(users.map((user) => {
        return new Promise((resolve) => {
          user = user.toObject();
          user = userController.redactUser(user);
          resolve(user);
        });
      })).then((cleanedUsers) => {
        return res.json(cleanedUsers);
      });
    }).catch((error) => {
      return res.status(500).json(error);
    });
  })

  // Create new user
  .post(requireAdmin, (req, res) => {
    if (!req.body.email || !req.body.account_name) {
      return res.status(400).json({ message: 'Bad request: include \'email\' and \'account_name\' fields' });
    }

    Users.findOne({ email: req.body.email }).then((ue) => {
      if (ue) { // Check for unique email
        return res.status(409).json({ message: 'Email address already associated to a user' });
      }

      Users.findOne({ account_name: req.body.account_name }).then((ua) => {
        if (ua) { // Check for unique account name
          return res.status(409).json({ message: 'Account name already associated to a user' });
        }

        const user = new Users();

        Object.keys(req.body).forEach((key) => {
          user[key] = req.body[key];
        });

        user.save().then((savedUser) => {
          savedUser = savedUser.toObject();
          savedUser = userController.redactUser(savedUser);
          return res.json(savedUser);
        }).catch((error) => {
          return res.status(500).json(error);
        });
      }).catch((error) => {
        return res.status(500).json(error);
      });
    }).catch((error) => {
      return res.status(500).json(error);
    });
  });

router.route('/:id')

  // Get user by ID
  .get((req, res) => {
    Users.findById(req.params.id).then((user) => {
      user = user.toObject();
      user = userController.redactUser(user);
      return res.json(user);
    }).catch((error) => {
      if (error.message && error.message.startsWith('User with id:')) {
        return res.status(404).json(error.message);
      } else {
        return res.status(500).json(error.message);
      }
    });
  })

  // Update user by ID
  .put(requireAuth, (req, res) => {
    // Only admins and same organization account can update organization pages
    // eslint-disable-next-line eqeqeq
    if (!req.user.is_admin && req.user._id != req.params.id) {
      return res.status(403).json({ message: 'You are not authorized to access this user' });
    }

    let validUpdates = {};
    if (!req.user.is_admin) {
      // Only include a key is a user is allowed to modify each requested field
      Object.keys(req.body).forEach((k) => {
        if (constants.UNPROTECTED_USER_FIELDS.includes(k)) {
          validUpdates[k] = req.body[k];
        }
      });
    } else {
      // Admins can change all fields
      validUpdates = req.body;
    }

    Users.updateOne({ _id: req.params.id }, validUpdates).then(() => {
      // Fetch user object and send
      Users.findById(req.params.id).then((updatedUser) => {
        updatedUser = updatedUser.toObject();
        updatedUser = userController.redactUser(updatedUser);
        return res.json(updatedUser);
      }).catch((error) => {
        return res.status(500).json(error);
      });
    }).catch((error) => {
      if (error.name === 'CastError' && error.path === '_id') {
        return res.status(404).json(error.message);
      } else {
        return res.status(500).json(error);
      }
    });
  })

  // Delete user by ID
  .delete(requireAdmin, (req, res) => {
    Users.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result.deletedCount === 1) { // Successful deletion
          return res.json(Object.assign({ message: `User with id: ${req.params.id} was successfully deleted` }, result));
        } else {
          return res.status(500).json(Object.assign({ message: 'Listing not able to be deleted' }, result));
        }
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  });

export default router;
