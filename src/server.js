import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { Client as PostgreSQLClient } from 'pg';

dotenv.config();

// initialize
const app = express();

// enable CORS
app.use(cors());

// configure logging
app.use(morgan('dev'));

// configure data type
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

import {
  articleRouter, authRouter, userRouter, feedRouter, pollRouter, authorRouter, tagRouter,
} from './routers';

// declare routers
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/articles', articleRouter);
app.use('/polls', pollRouter);
app.use('/feed', feedRouter);
app.use('/author', authorRouter);
app.use('/tags', tagRouter);

// default index route
app.get('/', (req, res) => {
  res.send('Welcome to hihihih!');
});

// custom 404 middleware
app.use((req, res) => {
  res.status(404).json({ message: 'The route you\'ve requested doesn\'t exist' });
});

const pgClient = new PostgreSQLClient({
  user: process.env.PGUSER,
  password: process.env.PGPASSWORD,
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  port: process.env.PGPORT
});
pgClient.connect();

// start the server
app.listen(process.env.PORT);

console.log(`listening on: ${process.env.PORT}`);