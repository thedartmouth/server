import express from 'express';
// import * as Resource from '../controllers/resource_controller';
import ResourceModel from '../models/resource_model';

const router = express();

// find and return all resources
router.route('/')
  .get((req, res) => {
    ResourceModel.find({}).then((resources) => {
      res.send(resources);
    }).catch((error) => {
      res.status(500).json({ error });
    });

    // Resource.getAllResources()
    //   .then((result) => {
    //     res.send(result);
    //   })
    //   .catch((error) => {
    //     res.status(500).send(error.message);
    //   });
  });

// .post((req, res) => {
//   // create resource
//   Resource.create(req.uid, req.body) // IMPORTANT: need to do something about req.uid (before: token.uid)
//     .then((result) => {
//       res.send(result);
//     })
//     .catch((error) => {
//       res.status(500).send(error.message);
//     });
// });

router.route('/id:')
  .get((req, res) => {
    // get specific resource
  })

  .put((req, res) => {
    // update specific resource
  })

  .delete((req, res) => {
    // delete specific resource
  });

export default router;
