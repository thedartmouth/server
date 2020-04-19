import express from 'express';

import User from '../models/user_model';
import { tokenForUser } from '../controllers/user_controller';

const router = express();

// Send { id: #### } and server will send back authToken and user object
router.route('/signin')
  .post((req, res) => {
    User.findById(req.body.id).then((user) => {
      const json = user.toJSON();
      delete json.password;
      res.send({ token: tokenForUser(user), user });
    }).catch((error) => {
      res.status(500).send(error);
    });
  });

export default router;
