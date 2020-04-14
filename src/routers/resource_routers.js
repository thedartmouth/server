import express from 'express';
import * as Resource from '../controllers/resource_controller';

const router = express();

// find and return all resources
router.route('/')
  .get((req, res) => {
    Resource.find({}).then((resources) => {
      res.send(resources);
    }).catch((error) => {
      res.status(500).json({ error });
    });

    Resource.getAllResources()
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  })
  .post((req, res) => {
  // create resource
    new Promise((resolve, reject) => { // req = user
      const resource = new Resource();

      resource._id = req.params.id;
      resource.date_account_created = Date.now();
      resource.stripe_id = req.fields.stripe_id ? req.fields.stripe_id : undefined;

      resource.save();
    })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error.message);
      });
  });

router.route('/id:')
  .get((req, res) => {
    // get specific resource (provide unique token for id)
    Resource.read(req.params.id)
      .then((resource) => {
        res.send(resource);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('Resource with id:')) {
          res.status(404).send(error.message);
        } else {
          res.status(500).send(error.message);
        }
      });
  })

  .put((req, res) => {
    // update specific resource
    Resource.updateOne(req.params.id, req.body)
      .then(() => {
        // grab resource object
        Resource.read(req.params.id)
          .then((resource) => {
            res.send(resource);
          })
          .catch((error) => {
            if (error.message.startsWith('Resource with id:')) {
              res.status(404).send(error.message);
            } else {
              res.status(500).send(error.message);
            }
          });
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  })

  .delete((req, res) => {
    // delete specific resource
    new Promise((resolve, reject) => {
      Resource.deleteOne({ _id: req.params.id })
        .then(() => {
          resolve(`Resource with id: ${req.params.id} was successfully deleted`);
        })
        .catch((error) => {
          reject(error);
        });
    })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.send(error);
      });
  });

export default router;
