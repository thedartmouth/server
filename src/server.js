import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import {
  authRouter, userRouter, resourceRouter, searchRouter,
} from './routers';

import { requireAuth } from './authentication';

import * as constants from './constants';

// initialize
const app = express();

// enable/disable cross origin resource sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// declare routers
app.use('/auth', authRouter); // NOTE: Not secured
app.use('/users', requireAuth, userRouter); // NOTE: Completely secured to users
app.use('/resources', resourceRouter); // NOTE: Partially secured to users
app.use('/search', searchRouter); // NOTE: Not secured

// default index route
app.get('/', (req, res) => {
  res.send('Welcome to backend!');
});

// DB Setup
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};

// Connect the database
mongoose.connect(constants.MONGODB_URI, mongooseOptions).then(() => {
  mongoose.Promise = global.Promise; // configures mongoose to use ES6 Promises
  console.log('Connected to Database');
}).catch((err) => {
  console.log('Not Connected to Database ERROR! ', err);
});

// // Reset database route
// // WARNING: NOT CONFIGURED FOR DEPLOYMENT
// app.use('/reset', (req, res) => {
//   if (req.headers.key === LOAD_KEY_HERE) { // Configure or add additional logic (preferably from .env file)
//     mongoose.connection.db.dropDatabase(() => {
//       mongoose.connection.close(() => {
//         mongoose.connect(mongoURI).then(() => {
//           const authUser = new User();

//           authUser.first_name = 'FIRST_AUTOGEN';
//           authUser.last_name = 'LAST_AUTOGEN';
//           authUser.email = 'AUTOGEN@TEST.COM'; // Configure this
//           authUser.password = 'PASSWORD'; // Configure this

//           authUser.save().then((savedUser) => {
//             res.json({ message: `Reset database, created new user with id ${savedUser._id}`, user: savedUser });
//           });
//         });
//       });
//     });
//   } else {
//     res.status(401).json({ message: 'You are not authorized to perform this request' });
//   }
// });

// Custom 404 middleware
app.use((req, res) => {
  res.status(404).json({ message: 'The route you\'ve requested doesn\'t exist' });
});

// START THE SERVER
// =============================================================================
app.listen(constants.PORT);

console.log(`listening on: ${constants.PORT}`);
