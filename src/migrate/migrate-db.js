import mongoose from 'mongoose';
import readline from 'readline';

import { Users, Listings } from '../models';

import * as constants from '../constants';

// DB Setup
const mongooseOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  loggerLevel: 'error',
};

/**
 * Executes a modification only if a certain criteria is met. Returns a Promise that resolves the updated listing along with whether it was modified.
 * @param {ListingModel} originalListing
 */
const processListing = (originalListing) => {
  return new Promise((resolve, reject) => {
    if (originalListing.value === 1) { // fits criteria to be modified
      originalListing.title = 'MODIFIED';
      resolve(originalListing);
    } else reject(originalListing);
  });
};

/**
  * Executes asynchronous database migration with procedure defined in processListing for ListingSchema.
  */
const migrateListings = () => {
  return new Promise((resolve, reject) => {
    let modifiedCount = 0;
    Listings.find({}).exec().then((listings) => {
      Promise.all(
        listings.map((listing) => {
          return new Promise((resolve, reject) => {
            Listings.findById(listing._id).then((toUpdateListing) => {
              processListing(toUpdateListing).then((updatedListing) => {
                modifiedCount += 1;
                updatedListing.save().then((modifiedListing) => { return resolve(modifiedListing); });
              }).catch(() => { return resolve(null); });
            }).catch((findError) => { return reject(findError); });
          });
        }),
      ).then((modifiedListings) => {
        console.log(`Modified ${modifiedCount} Listing documents.`);
        modifiedListings.forEach((modifiedListing) => {
          if (modifiedListing) console.log(modifiedListing);
        });
        resolve(modifiedListings);
      }).catch((modifyingError) => { reject(modifyingError); });
    });
  });
};

/**
 * Executes a modification only if a certain criteria is met. Returns a Promise that resolves the updated listing along with whether it was modified.
 * @param {UserModel} originalUser
 */
const processUser = (originalUser) => {
  return new Promise((resolve, reject) => {
    if (originalUser.first_name === 'FIRST_AUTOGEN_1') { // fits criteria to be modified
      originalUser.first_name = 'MODIFIED';
      resolve(originalUser);
    } else reject(originalUser);
  });
};

/**
  * Executes asynchronous database migration with procedure defined in processUser for UserSchema.
  */
const migrateUsers = () => {
  return new Promise((resolve, reject) => {
    let modifiedCount = 0;
    Users.find({}).exec().then((users) => {
      Promise.all(
        users.map((user) => {
          return new Promise((resolve, reject) => {
            Users.findById(user._id).then((toUpdateUser) => {
              processUser(toUpdateUser).then((updatedUser) => {
                modifiedCount += 1;
                updatedUser.save().then((modifiedUser) => { return resolve(modifiedUser); });
              }).catch(() => { return resolve(null); });
            }).catch((findError) => { return reject(findError); });
          });
        }),
      ).then((modifiedUsers) => {
        console.log(`Modified ${modifiedCount} User documents.`);
        modifiedUsers.forEach((modifiedUser) => {
          if (modifiedUser) console.log(modifiedUser);
        });
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
      mongoose.Promise = global.Promise; // configures mongoose to use ES6 Promises
      console.log('Connected to Database.');
      Promise.all([migrateUsers(), migrateListings()]).then(() => {
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
cli.question(`Migrating the DB will modify the data connected to ${constants.MONGODB_URI}, are you sure? (Y/N)`, async (answer) => {
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
