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

// create and return a reference to a user object, if properly authenticated
const create = (uid, fields) => {
  return new Promise((resolve, reject) => {
    const resource = new Resource();

    resource._id = uid;
    resource.date_account_created = Date.now();
    resource.stripe_id = fields.stripe_id ? fields.stripe_id : undefined;

    resource.save();
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

// update given fields of user object and confirm success, if properly authenticated
const update = (uid, fields) => {
  return new Promise((resolve, reject) => {
    read(uid)
      .then((oldResource) => {
        Resource.updateOne({ _id: uid }, fields)
          .then(() => {
            // get new resource object with order stripe data attached
            read(uid)
              .then((updatedResource) => {
                resolve(updatedResource);
              })
              .catch((error) => {
                reject(error);
              });
          })
          .catch((error) => {
            reject(error);
          });
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// delete resource object and confirm success, if properly authenticated
const del = (uid) => {
  return new Promise((resolve, reject) => {
    Resource.deleteOne({ _id: uid })
      .then(() => {
        resolve(`Resource with id: ${uid} was successfully deleted`);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export {
  read, create, getAllResources, del, update,
};
