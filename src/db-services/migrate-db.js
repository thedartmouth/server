import mongoose from 'mongoose';
import readline from 'readline';

import { Users, Resources } from '../models';

import * as constants from '../constants';

// DB Setup
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};

/**
 * Executes a modification only if a certain criteria is met. Returns a Promise that resolves the updated resource along with whether it was modified.
 * @param {ResourceModel} originalResource
 */
const processResource = (originalResource) => {
  return new Promise((resolve, reject) => {
    if (originalResource) { // fits criteria to be modified
      resolve(originalResource);
    } else reject(originalResource);
  });
};

/**
  * Executes asynchronous database seeding with default values for ResourceSchema.
  */
const migrateResources = () => {
  return new Promise((resolve, reject) => {
    let modifiedCount = 0;
    Resources.find({}).then((resources) => {
      Promise.all(
        resources.map((resource) => {
          return new Promise((resolve, reject) => {
            Resources.findById(resource._id).then((toUpdateResource) => {
              processResource(toUpdateResource).then((updatedResource) => {
                modifiedCount += 1;
                updatedResource.save().then((modifiedResource) => { return resolve(modifiedResource); });
              });
            }).catch((findError) => { return reject(findError); });
          });
        }),
      ).then((modifiedResources) => {
        console.log(`Modified ${modifiedCount} new Resource documents`, modifiedResources);
        resolve(modifiedResources);
      }).catch((modifyingError) => { reject(modifyingError); });
    });
  });
};

/**
 * Executes a modification only if a certain criteria is met. Returns a Promise that resolves the updated resource along with whether it was modified.
 * @param {UserModel} originalUser
 */
const processUser = (originalUser) => {
  return new Promise((resolve, reject) => {
    if (originalUser) { // fits criteria to be modified
      resolve(originalUser);
    } else reject(originalUser);
  });
};

/**
  * Executes asynchronous database seeding with default values for UserSchema.
  */
const migrateUsers = () => {
  return new Promise((resolve, reject) => {
    let modifiedCount = 0;
    Users.find({}).then((users) => {
      Promise.all(
        users.map((user) => {
          return new Promise((resolve, reject) => {
            Resources.findById(user._id).then((toUpdateUser) => {
              processUser(toUpdateUser).then((updatedUser) => {
                modifiedCount += 1;
                updatedUser.save().then((modifiedUser) => { return resolve(modifiedUser); });
              });
            }).catch((findError) => { return reject(findError); });
          });
        }),
      ).then((modifiedUsers) => {
        console.log(`Modified ${modifiedCount} new Resource documents`, modifiedUsers);
        resolve(modifiedUsers);
      }).catch((modifyingError) => { reject(modifyingError); });
    });
  });
};

/**
 * Main migration script.
 * Connects to current mongoURI and executes each schema's migration script.
 */
const migrateDB = () => {
  return new Promise((resolve) => {
    mongoose.connect(constants.MONGODB_URI, mongooseOptions).then(() => {
      console.log('Connected to Database');
      Promise.all([migrateResources, migrateUsers]).then(() => {
        console.log('Migration complete. Safe to exit.');
        resolve();
      }).catch((migrationError) => { throw new Error(migrationError); });
    }).catch((connectionError) => {
      throw new Error(connectionError);
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
      await migrateDB();
      break;
    default:
      console.log('Aborting... database will NOT be seeded.');
      break;
  }
});
