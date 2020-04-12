import express from 'express';
// import * as admin from 'firebase-admin';
import * as User from '../controllers/user_controller';

const router = express();

// find and return all users
router.route('/')
  .get((req, res) => {
    if (req.headers.authorization) {
      User.isAdminToken(req.headers.authorization)
        .then((ans) => {
          if (ans) {
            User.getAllUsers()
              .then((result) => {
                res.send(result);
              })
              .catch((error) => {
                res.status(500).send(error.message);
              });
          } else {
            res.status(403).send(new Error(`User with token: ${req.headers.authorization} is not an admin user.`));
          }
        })
        .catch((error) => {
          res.status(500).send(error.message);
        });
    } else {
      res.status(400).send('Must provide authorization header.');
    }
  });


// router.route('/:id')
//   .get((req, res) => {
//   // authenticate user token
//     admin.auth().verifyIdToken(req.params.id)
//       .then((decodedToken) => {
//         // grab user object
//         User.read(decodedToken.uid)
//           .then((user) => {
//             res.send(user);
//           })
//           .catch((error) => {
//             if (error.message && error.message.startsWith('User with id:')) {
//               res.status(404).send(error.message);
//             } else {
//               res.status(500).send(error.message);
//             }
//           });
//       })
//       // authentication of token failed
//       .catch((error) => {
//         res.status(401).send(error.message);
//       });
//   })
//   .post((req, res) => {
//     // authenticate user token
//     admin.auth().verifyIdToken(req.params.id)
//     // create user
//       .then((decodedToken) => {
//         const User = new User();

//         user._id = uid;
//         user.email = fields.email ? fields.email : undefined;
//         user.first_name = fields.first_name ? fields.first_name : '';
//         user.last_name = fields.last_name ? fields.last_name : undefined;
//         user.phone_number = fields.phone_number ? fields.phone_number : undefined;
//         user.zip_code = fields.zip_code ? fields.zip_code : undefined;
//         user.date_account_created = Date.now();
//         user.stripe_id = fields.stripe_id ? fields.stripe_id : undefined;
//         user.admin_user = false;
//         user.push_notification_registration_tokens = fields.push_notification_registration_tokens ? fields.push_notification_registration_tokens : [];

//         user.save(); // omitted code for save();
//       })
//       // authentication of token failed
//       .catch((error) => {
//         res.status(401).send(error.message);
//       });
//   })
//   .put((req, res) => {
//     // authenticate user token
//     admin.auth().verifyIdToken(req.params.id)
//     // update user
//       .then((decodedToken) => {
//         User.updateOne(decodedToken.uid, req.body)
//           .then(() => {
//             // grab user object
//             User.read(decodedToken.uid)
//               .then((user) => {
//                 res.send(user); // replaced code that used the Order controller
//               })
//               .catch((error) => {
//                 if (error.message.startsWith('User with id:')) {
//                   res.status(404).send(error.message);
//                 } else {
//                   res.status(500).send(error.message);
//                 }
//               });
//           })
//           .catch((error) => {
//             res.status(500).send(error);
//           });
//       })
//       // authentication of token failed
//       .catch((error) => {
//         res.status(401).send(error.message);
//       });
//   })
//   .delete((req, res) => {
//     // authenticate user token
//     admin.auth().verifyIdToken(req.params.id)
//     // delete user
//       .then((decodedToken) => {
//         User.deleteOne(decodedToken.uid)
//           .then() => {
//             resolve('User with id: ${uid} was successfully deleted`);
//           })
//           .catch((error) => {
//             reject(error);
//           });
//       })
//   });

// router.route('/admin/verify')
//   // signs an admin user in
//   .post((req, res) => {
//     // authenticate user token
//     if (req.body.token) {
//       admin.auth().verifyIdToken(req.body.token)
//         .then((decodedToken) => {
//           User.isAdminUser(decodedToken.uid)
//             .then((ans) => {
//               if (ans) {
//                 res.send(true);
//               } else {
//                 res.status(403).send(new Error(`User with id: ${decodedToken.uid} is not an admin user.`));
//               }
//             })
//             .catch((error) => {
//               console.log(error);
//               res.status(500).send(error.message);
//             });
//         }).catch((error) => {
//           console.log(error);
//           res.status(401).send(error.message);
//         });
//     } else {
//       res.status(400).send('Must provide authentication token to verify');
//     }
//   });


export default router;
