import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import path from 'path';
import morgan from 'morgan';
import mongoose from 'mongoose';

import usersRouter from './routers/user_routers';
import resourcesRouter from './routers/resource_routers';

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
app.use('/users', usersRouter);
app.use('/resources', resourcesRouter);

// default index route
app.get('/', (req, res) => {
  res.send('Welcome to Granite State Backend!');
});

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/granite-state';
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};
mongoose.connect(mongoURI, mongooseOptions).then(() => {
  console.log('Connected to Database');
}).catch((err) => {
  console.log('Not Connected to Database ERROR! ', err);
});

// START THE SERVER
// =============================================================================
const port = process.env.PORT || 9090;
app.listen(port);

console.log(`listening on: ${port}`);
