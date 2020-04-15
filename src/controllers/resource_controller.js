import Resource from '../models/resource_model';

// Create functions to manage resource data

// grab and return a reference to a user object, if properly authenticated
const read = (uid) => {
  return new Promise((resolve, reject) => {
    // grab user object or send 404 if not found
    Resource.findOne({ _id: uid })
      .then((foundUser) => {
        if (foundUser !== null) {
          resolve(foundUser);
        } else {
          reject(new Error(`Resource with id: ${uid} not found`));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// grab and return a reference to all user objects
const getAllResources = () => {
  return new Promise((resolve, reject) => {
    // grab user object or send 404 if not found
    Resource.find({})
      .then((foundResources) => {
        if (foundResources !== null) {
          const promises = [];

          // attach full user object to each one
          foundResources.forEach((resource) => {
            promises.push(read(resource._id)); // changed getFullUserObject for read
          });

          Promise.all(promises)
            .then((allFullResources) => {
              resolve(allFullResources);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error('Could not get all resources'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  read, getAllResources, // pass update to router
};
