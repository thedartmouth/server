import mongoose from 'mongoose';
import readline from 'readline';

import { Users, Listings } from '../models';

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

          Object.entries(entry).forEach(([key, value]) => {
            try {
              newUser[key] = entry[key];
            } catch (error) {
              console.error(error);
            }
          });

          newUser.save()
            .then((savedUser) => { return resolve(savedUser); })
            .catch((savingError) => { return reject(savingError); });
        });
      }),
    ).then((newUsers) => {
      console.log(`Seeded ${entries.length} new User documents`, newUsers);
      resolve(newUsers);
    }).catch((seedingError) => { reject(seedingError); });
  });
};

/**
  * Executes asynchronous database seeding with default values for ListingSchema.
  * @param {ListingSchema} entries
  */
const seedListings = (entries) => {
  return new Promise((resolve, reject) => {
    Promise.all(
      entries.map((entry) => {
        return new Promise((resolve, reject) => {
          const newListing = new Listings();

          Object.entries(entry).forEach(([key, value]) => {
            newListing[key] = entry[key];
          });

          newListing.save()
            .then((savedListing) => { return resolve(savedListing); })
            .catch((savingError) => { return reject(savingError); });
        });
      }),
    ).then((savedListings) => {
      console.log(`Seeded ${entries.length} new Listing documents`, savedListings);
      resolve(savedListings);
    }).catch((seedingError) => { reject(seedingError); });
  });
};

/**
 * Links together all documents that have fields which reference other documents.
 */
const linkDocuments = () => {
  return new Promise((resolve) => {
    Listings.find({}).then((listings) => {
      Promise.all(listings.map((listing) => {
        return new Promise((resolve) => {
          Listings.findById(listing._id).then((listingToModify) => {
            listingToModify.save().then((modifiedListing) => { return resolve(modifiedListing._id); });
          });
        });
      })).then((modifiedListings) => {
        Users.find({}).then((users) => {
          Promise.all(users.map((user) => {
            return new Promise((resolve) => {
              Users.findById(user._id).then((userToModify) => {
                userToModify.listing = modifiedListings[0]._id;
                userToModify.save().then((modifiedUser) => { return resolve(modifiedUser._id); });
              });
            });
          })).then(() => {
            resolve();
          });
        });
      });
    });
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
                    case 'Listing':
                      seedListings(schemaSet.data).then((seededData) => { return resolve(seededData); }).catch((seedingError) => { return reject(seedingError); });
                      break;
                    default:
                      reject(new Error('Invalid schema type specified in input data.'));
                  }
                });
              }),
            ).then(() => {
              console.log('Seeding complete.');
              linkDocuments().then(() => {
                console.log('Newly seeded documents linked for testing. Safe to exit.');
                resolve();
              });
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
