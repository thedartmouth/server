import User from '../models/user_model';

// Create functions to manage user data
// These functions were not copied into user_routers because they are large and/or
// they are used more than once

// grab and return a reference to a user object, if properly authenticated
const read = (uid) => {
  return new Promise((resolve, reject) => {
    // grab user object or send 404 if not found
    User.findOne({ _id: uid })
      .then((foundUser) => {
        if (foundUser !== null) {
          resolve(foundUser);
        } else {
          reject(new Error(`User with id: ${uid} not found`));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// grab and return a reference to all user objects
const getAllUsers = () => {
  return new Promise((resolve, reject) => {
    // grab user object or send 404 if not found
    User.find({})
      .then((foundUsers) => {
        if (foundUsers !== null) {
          const promises = [];

          // attach full user object to each one
          foundUsers.forEach((user) => {
            promises.push(read(user._id)); // changed getFullUserObject for read
          });

          Promise.all(promises)
            .then((allFullUsers) => {
              resolve(allFullUsers);
            })
            .catch((error) => {
              reject(error);
            });
        } else {
          reject(new Error('Could not get all users'));
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// export all functions

export {
  read, getAllUsers,
};
