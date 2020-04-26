import express from 'express';

import User from '../models/user_model';
import { tokenForUser } from '../controllers/user_controller';
import requireSignin from '../authentication/requireSignin';

const router = express();


// Send user object and server will send back authToken and user object
router.route('/signin')
  .post(requireSignin, (req, res) => {
    // This information is loaded by passport
    const json = req.user.toJSON();
    delete json.password;
    res.send({ token: tokenForUser(json), user: json });
  });

export default router;
