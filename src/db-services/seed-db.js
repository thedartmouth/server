import mongoose from 'mongoose';
import UserModel from '../models/user_model';
import ResourceModel from '../models/resource_model';
import seedData from './seed-data.json';

// DB Setup
const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost/granite-state';
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};

/**
 * Executes asynchronous database seeding with default values for UserSchema.
 * @param {UserSchema} entries
 */
const seedUsers = (entries) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      entries.map((entry) => {
        return new Promise(resolve, (reject) => {
          const newUser = new UserModel();
          newUser.first_name = entry.first_name;
          newUser.last_name = entry.last_name;
          newUser.email = entry.email;
          newUser.password = entry.password;
          newUser.save().then((savedUser) => { return resolve(savedUser); }).catch((newUserSavingError) => { return reject(newUserSavingError); });
        });
      }),
    ).then((savedNewUsers) => {
      resolve(savedNewUsers);
    }).catch((userSeedingError) => { reject(userSeedingError); });
  });
};

/**
 * Executes asynchronous database seeding with default values for ResourceSchema.
 * @param {ResourceSchema} entries
 */
const seedResources = (entries) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      entries.map((entry) => {
        return new Promise(resolve, (reject) => {
          const newUser = new ResourceModel();
          newUser.title = entry.title;
          newUser.description = entry.description;
          newUser.value = entry.value;
          newUser.date_resource_created = entry.date_resource_created;
          newUser.save().then((savedResource) => { return resolve(savedResource); }).catch((newResourceSavingError) => { return reject(newResourceSavingError); });
        });
      }),
    ).then((savedNewResources) => {
      resolve(savedNewResources);
    }).catch((resourceSeedingError) => { reject(resourceSeedingError); });
  });
};

// Connect the database
mongoose.connect(mongoURI, mongooseOptions).then(() => {
  console.log('Connected to Database');
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => {
      mongoose.connect(mongoURI).then(() => {
        seedData = seedData.toJSON();
        Promise.all(
          seedData.map((schemaSet) => {
            return new Promise((resolve, reject) => {
              switch (schemaSet.schema) {
                case 'User':
                  seedUsers(schemaSet.data).then((seededData) => { return resolve(seededData); }).catch((seedError) => { return reject(seedError); });
                  break;
                case 'Resource':
                  seedResources(schemaSet.data).then((seededData) => { return resolve(seededData); }).catch((seedError) => { return reject(seedError); });
                  break;
                default:
                  reject(new Error('Invalid schema type specified in input data.'));
              }
            });
          }),
        ).then((seededSchemas) => {
          console.log('Seeding complete. Safe to exit.');
          console.log(seededSchemas);
        });
      });
    });
  });
}).catch((err) => {
  console.log('Not connected to database error! ', err);
});
