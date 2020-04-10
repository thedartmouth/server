// import * as firebase from 'firebase';
// import * as admin from 'firebase-admin';
import User from '../models/user_model';

// Create functions to manage user data

// const signedInWithEmailPassword = (email) => {
//   return new Promise((resolve, reject) => {
//     firebase.auth().fetchSignInMethodsForEmail(email)
//       .then((signInMethods) => {
//         resolve(signInMethods.indexOf(firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) !== -1);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // grab and return a reference to a user object, if properly authenticated
// const read = (uid) => {
//   return new Promise((resolve, reject) => {
//     // grab user object or send 404 if not found
//     User.findOne({ _id: uid })
//       .then((foundUser) => {
//         if (foundUser !== null) {
//           resolve(foundUser);
//         } else {
//           reject(new Error(`User with id: ${uid} not found`));
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// const isAdminUser = (uid) => {
//   return new Promise((resolve, reject) => {
//     read(uid)
//       .then((user) => {
//         resolve(user.admin_user);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// const isAdminToken = (token) => {
//   return new Promise((resolve, reject) => {
//     admin.auth().verifyIdToken(token)
//       .then((decodedToken) => {
//         isAdminUser(decodedToken.uid)
//           .then((ans) => {
//             resolve(ans);
//           })
//           .catch((error) => {
//             reject(error);
//           });
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // update given fields of user object and confirm success, if properly authenticated
// const update = (uid, fields) => {
//   return new Promise((resolve, reject) => {
//     read(uid)
//       .then((oldUser) => {
//         User.updateOne({ _id: uid }, fields)
//           .then(() => {
//             // get new user object with order stripe data attached
//             read(uid)
//               .then((updatedUser) => {
//                 resolve(updatedUser);
//               })
//               .catch((error) => {
//                 reject(error);
//               });
//           })
//           .catch((error) => {
//             reject(error);
//           });
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // create and return a reference to a user object, if properly authenticated
// const create = (uid, fields) => {
//   return new Promise((resolve, reject) => {
//     const user = new User();

//     user._id = uid;
//     user.email = fields.email ? fields.email : undefined;
//     user.first_name = fields.first_name ? fields.first_name : '';
//     user.last_name = fields.last_name ? fields.last_name : undefined;
//     user.phone_number = fields.phone_number ? fields.phone_number : undefined;
//     user.zip_code = fields.zip_code ? fields.zip_code : undefined;
//     user.date_account_created = Date.now();
//     user.stripe_id = fields.stripe_id ? fields.stripe_id : undefined;
//     user.admin_user = false;
//     user.push_notification_registration_tokens = fields.push_notification_registration_tokens ? fields.push_notification_registration_tokens : [];

//     user.save(); // omitted code for save();
//   });
// };

// // delete user object and confirm success, if properly authenticated
// const del = (uid) => {
//   return new Promise((resolve, reject) => {
//     User.deleteOne({ _id: uid })
//       .then(() => {
//         resolve(`User with id: ${uid} was successfully deleted`);
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

// // grab and return a reference to all user objects
// const getAllUsers = () => {
//   return new Promise((resolve, reject) => {
//     // grab user object or send 404 if not found
//     User.find({})
//       .then((foundUsers) => {
//         if (foundUsers !== null) {
//           const promises = [];

//           // attach full user object to each one
//           foundUsers.forEach((user) => {
//             promises.push(read(user._id)); // changed getFullUserObject for read
//           });

//           Promise.all(promises)
//             .then((allFullUsers) => {
//               resolve(allFullUsers);
//             })
//             .catch((error) => {
//               reject(error);
//             });
//         } else {
//           reject(new Error('Could not get all users'));
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };


// export all functions

// export {
//   signedInWithEmailPassword, read, isAdminToken, isAdminUser, create, update, del, getAllUsers,
// };
