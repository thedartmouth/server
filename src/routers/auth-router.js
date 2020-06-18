import express from 'express';
import validator from 'email-validator';

import { userController } from '../controllers';
import { requireSignin, tokenForUser } from '../authentication';
import { Users } from '../models';

const authRouter = express();

authRouter.route('/signup')
  .post((req, res) => {
    const {
      email, password, firstName, lastName,
    } = req.body;

    Users.findOne().byEmail(email).then((user) => {
      // Check if a user already has this email address
      if (user) {
        return res.status(409).json({ message: 'Email address already associated to a user' });
      }

      // Validate email and password
      if (!email || !validator.validate(email)) {
        return res.status(409).json({ message: 'Please enter a valid email address' });
      } else if (!password) {
        return res.status(409).json({ message: 'Please enter a password' });
      }

      // Make a new user from passed data
      const newUser = new Users({
        email: email.toLowerCase(),
        password,
        name: `${firstName} ${lastName}`,
      });

      // Save the user then transmit to frontend
      return newUser.save()
        .then((savedUser) => {
          let json = savedUser.toJSON();
          json = userController.removePassword(json);
          res.status(201).json({ token: tokenForUser(savedUser), user: json });
        }).catch((error) => {
          console.log(typeof tokenForUser);
          return res.status(500).json(error);
        });
    }).catch((error) => {
      return res.status(500).json(error);
    });
  });

// Send user object and server will send back authToken and user object
authRouter.route('/signin')
  .post(requireSignin, (req, res) => {
    // This information is loaded or rejected by passport
    let json = req.user.toJSON();
    console.log(json);
    json = userController.removePassword(json);
    return res.json({ token: tokenForUser(json), user: json });
  });

export default authRouter;
