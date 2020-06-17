import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';

import {
  articleRouter, authRouter, userRouter, feedRouter, pollRouter,
} from './routers';

import * as constants from './constants';

// initialize
const app = express();

// enable/disable cross origin listing sharing if necessary
app.use(cors());

// enable/disable http request logging
app.use(morgan('dev'));

// enable json message body for posting data to API
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// declare routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/articles', articleRouter);
app.use('/polls', pollRouter);
app.use('/feed', feedRouter);

// default index route
app.get('/', (req, res) => {
  res.send('Welcome to hihihih!');
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
  console.log('Not Connected to Database ERROR!  ', err);
});

// Custom 404 middleware
app.use((req, res) => {
  res.status(404).json({ message: 'The route you\'ve requested doesn\'t exist' });
});

// START THE SERVER
// =============================================================================
app.listen(constants.PORT);

console.log(`listening on: ${constants.PORT}`);
