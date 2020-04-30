import mongoose from 'mongoose';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/granite-state';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};

// Connect the database
mongoose.connect(mongoURI, mongooseOptions).then(() => {
  console.log('Connected to Database');
}).catch((err) => {
  console.log('Not Connected to Database ERROR! ', err);
});
