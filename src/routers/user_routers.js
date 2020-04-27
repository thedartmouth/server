import express from 'express';

import User from '../models/user_model';
// import { tokenForUser } from '../controllers/user_controller';

const router = express();

// find and return all users
router.route('/')

  // Get all users
  .get((req, res) => {
    User.find({}).then((users) => {
      return res.send(users);
    }).catch((error) => {
      return res.status(500).send(error);
    });
  })

  // Create new user
  .post((req, res) => {
    const user = new User();

    console.log(req.body);

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save()
      .then((savedUser) => {
        return res.send(savedUser);
      }).catch((error) => {
        console.error(error);
        return res.status(500).send(error);
      });
  });

router.route('/:id')

  // Get user by id
  .get((req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        return res.send(user);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('User with id:')) {
          return res.status(404).send(error.message);
        } else {
          return res.status(500).send(error.message);
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
            return res.send(resource);
          })
          .catch((error) => {
            if (error.message.startsWith('User with id:')) {
              return res.status(404).send(error.message);
            } else {
              return res.status(500).send(error.message);
            }
          });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  })

  // Delete user by id
  .delete((req, res) => {
    User.deleteOne({ _id: req.params.id })
      .then(() => {
        return res.send(`User with id: ${req.params.id} was successfully deleted`);
      })
      .catch((error) => {
        return res.send(error);
      });
  });

export default router;
