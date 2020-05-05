import mongoose from 'mongoose';
import readline from 'readline';

import { Users, Resources } from '../models';

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
          const newUser = new Users();
          newUser.first_name = entry.first_name;
          newUser.last_name = entry.last_name;
          newUser.email = entry.email;
          newUser.password = entry.password;
          newUser.save().then((savedUser) => { return resolve(savedUser); }).catch((savingError) => { return reject(savingError); });
        });
      }),
    ).then((newUsers) => {
      console.log(`Seeded ${entries.length} new User documents`, newUsers);
      resolve(newUsers);
    }).catch((seedingError) => { reject(seedingError); });
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
          const newUser = new Resources();
          newUser.title = entry.title;
          newUser.description = entry.description;
          newUser.value = entry.value;
          newUser.date_resource_created = entry.date_resource_created;
          newUser.save().then((savedResource) => { return resolve(savedResource); }).catch((savingError) => { return reject(savingError); });
        });
      }),
    ).then((savedResources) => {
      console.log(`Seeded ${entries.length} new Resource documents`, savedResources);
      resolve(savedResources);
    }).catch((seedingError) => { reject(seedingError); });
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
                      seedUsers(schemaSet.data).then((seededData) => { return resolve(seededData); }).catch((seedingError) => { return reject(seedingError); });
                      break;
                    case 'Resource':
                      seedResources(schemaSet.data).then((seededData) => { return resolve(seededData); }).catch((seedingError) => { return reject(seedingError); });
                      break;
                    default:
                      reject(new Error('Invalid schema type specified in input data.'));
                  }
                });
              }),
            ).then(() => {
              console.log('Seeding complete. Safe to exit.');
              resolve();
            }).catch((seedingError) => { throw new Error(seedingError); });
          }).catch((connectionError) => {
            throw new Error(connectionError);
          });
        });
      });
    }).catch((connectionError) => {
      throw new Error(connectionError);
    });
  });
};

const cli = readline.createInterface({ input: process.stdin, output: process.stdout });
cli.question(`Seeding the DB will delete all data connected to ${constants.MONGODB_URI}, are you sure? (Y/N)`, async (answer) => {
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
