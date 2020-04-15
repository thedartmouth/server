import express from 'express';
// import * as Resource from '../controllers/resource_controller';
import Resource from '../models/resource_model';

const router = express();

// find and return all resources
router.route('/')
  .get((req, res) => {
    Resource.find({}).then((resources) => {
      res.send(resources);
    }).catch((error) => {
      res.status(500).json({ error });
    });
  })
  .post((req, res) => {
    // create resource
    // res.send('test response');
    new Promise((resolve, reject) => { // req = user
      const resource = new Resource();

      resource.title = req.body.title;
      resource.description = req.body.title;
      resource.date_account_created = Date.now();

      resource.save()
        .then(() => { return resolve(); })
        .catch((error) => { return reject(error); });
    })
      .then((result) => {
        res.send(result);
      })
      .catch((error) => {
        res.status(500).send(error);
      });
  });

router.route('/:id')
  .get((req, res) => {
    Resource.findById(req.params.id)
      .then((resource) => {
        res.send(resource);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('Resource with id:')) {
          res.status(404).send(error);
        } else {
          res.status(500).send(error);
        }
      });
  })
  .put((req, res) => {
    // update specific resource
    Resource.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // grab resource object
        Resource.findById(req.params.id)
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
    Resource.deleteOne({ _id: req.params.id })
      .then(() => {
        res.send(`Resource with id: ${req.params.id} was successfully deleted`);
      })
      .catch((error) => {
        res.send(error);
      });
  });

export default router;
