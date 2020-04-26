import express from 'express';

import { tokenForUser } from '../controllers/user_controller';
import requireSignin from '../authentication/requireSignin';
import User from '../models/user_model';

const router = express();

router.route('/signup')
  .post((req, res) => {
    const {
      email, password, firstName, lastName,
    } = req.body;

    return User.findOne({ email }).then((user) => {
      // Check if a user already has this email address
      if (user) {
        return res.status(409).send({ message: 'Email address already associated to a user' });
      }

      // Validate email and password
      if (!email) {
        // TODO: Validate email formatting
        res.status(409).send({ message: 'Please enter an email address' });
      } else if (!password) {
        res.status(409).send({ message: 'Please enter a password' });
      }

      // Make a new user from passed data
      const newUser = new User({
        email: email.toLowerCase(),
        password,
        first_name: firstName,
        last_name: lastName,
      });

      // Save the user then transmit to frontend
      return newUser.save()
        .then((savedUser) => {
          const json = savedUser.toJSON();
          delete json.password;
          res.send({ token: tokenForUser(savedUser), user: json });
        }).catch((error) => {
          res.status(500).send(error);
        });
    }).catch((error) => {
      res.status(500).send(error);
    });
  });

// Send user object and server will send back authToken and user object
router.route('/signin')
  .post(requireSignin, (req, res) => {
    // This information is loaded by passport
    const json = req.user.toJSON();
    delete json.password;
    res.send({ token: tokenForUser(json), user: json });
  });

export default router;
