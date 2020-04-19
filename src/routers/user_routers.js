import express from 'express';

import User from '../models/user_model';
import { tokenForUser } from '../controllers/user_controller';

const router = express();

// find and return all users
router.route('/')

  // Get all users
  .get((req, res) => {
    User.find({}).then((users) => {
      res.send(users);
    }).catch((error) => {
      res.status(500).send(error);
    });
  })

  // Create new user
  .post((req, res) => {
    const user = new User();

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;

    user.save()
      .then((savedUser) => {
        res.send(savedUser);
      }).catch((error) => {
        res.status(500).send(error);
      });
  });

router.route('/:id')

  // Get user by id
  .get((req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        res.send(user);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('User with id:')) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      });
  })

  // Update user by id
  .put((req, res) => {
    User.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // Fetch user object and send
        User.findById(req.params.id)
          .then((resource) => {
            res.send(resource);
          })
          .catch((error) => {
            if (error.message.startsWith('User with id:')) {
              res.status(404).send(error.message);
            } else {
              res.status(500).send(error.message);
            }
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  })

  // Delete user by id
  .delete((req, res) => {
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        res.send(`User with id: ${req.params.id} was successfully deleted`);
      })
      .catch((error) => {
        res.send(error);
      });
  });

export default router;
