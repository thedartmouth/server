import mongoose from 'mongoose';
import readline from 'readline';

import UserModel from '../models/user_model';
import ResourceModel from '../models/resource_model';

import seedData from './seed-data.json';

import * as constants from '../constants';

// DB Setup
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
        return new Promise((resolve, reject) => {
          const newUser = new UserModel();
          newUser.first_name = entry.first_name;
          newUser.last_name = entry.last_name;
          newUser.email = entry.email;
          newUser.password = entry.password;
          newUser.save().then((savedUser) => { return resolve(savedUser); }).catch((newUserSavingError) => { return reject(newUserSavingError); });
        });
      }),
    ).then((savedNewUsers) => {
      console.log(`Seeded ${entries.length} new User documents`, savedNewUsers);
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
        return new Promise((resolve, reject) => {
          const newUser = new ResourceModel();
          newUser.title = entry.title;
          newUser.description = entry.description;
          newUser.value = entry.value;
          newUser.date_resource_created = entry.date_resource_created;
          newUser.save().then((savedResource) => { return resolve(savedResource); }).catch((newResourceSavingError) => { return reject(newResourceSavingError); });
        });
      }),
    ).then((savedNewResources) => {
      console.log(`Seeded ${entries.length} new Resource documents`, savedNewResources);
      resolve(savedNewResources);
    }).catch((resourceSeedingError) => { reject(resourceSeedingError); });
  });
};

/**
 * Main seed script.
 * Connects to current mongoURI, drops the database, and then re-populates with default values.
 */
const seedDB = () => {
  return new Promise((resolve) => {
  // Connect the database
    mongoose.connect(constants.MONGODB_URI, mongooseOptions).then(() => {
      console.log('Connected to Database');
      mongoose.connection.db.dropDatabase(() => {
        mongoose.connection.close(() => {
          mongoose.connect(constants.MONGODB_URI).then(() => {
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
            ).then(() => {
              console.log('Seeding complete. Safe to exit.');
              resolve();
            });
          }).catch((connectionError) => {
            console.log('Trouble connecting to DB after drop', connectionError);
          });
        });
      });
    }).catch((err) => {
      console.log('Not connected to database error! ', err);
    });
  });
};


const cli = readline.createInterface({ input: process.stdin, output: process.stdout });
cli.question(`Seeding the DB will delete all data connected to ${mongoURI}, are you sure? (Y/N)`, async (answer) => {
  cli.close();
  switch (answer) {
    case 'Y':
      await seedDB();
      break;
    default:
      console.log('Aborting... database will NOT be seeded.');
      break;
  }
});
