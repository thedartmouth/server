import express from 'express';

import { Users } from '../models';
// import { userController } from '../controllers';

const router = express();

// find and return all users
router.route('/')

  // Get all users
  .get((req, res) => {
    Users.find({}).then((users) => {
      return res.json(users);
    }).catch((error) => {
      return res.status(500).json(error);
    });
  })

  // Create new user
  .post((req, res) => {
    const user = new Users();

    user.first_name = req.body.first_name;
    user.last_name = req.body.last_name;
    user.email = req.body.email;
    user.password = req.body.password;

    user.save()
      .then((savedUser) => {
        return res.json(savedUser);
      }).catch((error) => {
        return res.status(500).json(error);
      });
  });

router.route('/:id')

  // Get user by id
  .get((req, res) => {
    Users.findById(req.params.id)
      .then((user) => {
        return res.json(user);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('User with id:')) {
          return res.status(404).json(error.message);
        } else {
          return res.status(500).json(error.message);
        }
      });
  })

  // Update user by id
  .put((req, res) => {
    Users.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // Fetch user object and send
        Users.findById(req.params.id)
          .then((resource) => {
            return res.json(resource);
          })
          .catch((error) => {
            if (error.message.startsWith('User with id:')) {
              return res.status(404).json(error.message);
            } else {
              return res.status(500).json(error.message);
            }
          });
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  })

  // Delete user by id
  .delete((req, res) => {
    Users.deleteOne({ _id: req.params.id })
      .then((result) => {
        if (result.deletedCount === 1) { // Successful deletion
          return res.json(Object.assign({ message: `User with id: ${req.params.id} was successfully deleted` }, result));
        } else {
          return res.status(500).json(Object.assign({ message: 'Resource not able to be deleted' }, result));
        }
      })
      .catch((error) => {
        return res.status(500).json(error);
      });
  });

export default router;
