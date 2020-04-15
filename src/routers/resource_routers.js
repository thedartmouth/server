import express from 'express';
// import * as Resource from '../controllers/resource_controller';
import Resource from '../models/resource_model';

const router = express();

// find and return all resources
router.route('/')

  // Get all resources
  .get((req, res) => {
    Resource.find({}).then((resources) => {
      res.send(resources);
    }).catch((error) => {
      res.status(500).json({ error });
    });
  })

  // Create new resource
  .post((req, res) => {
    const resource = new Resource();

    resource.title = req.body.title;
    resource.description = req.body.title;
    resource.date_account_created = Date.now();

    resource.save()
      .then((savedResource) => {
        res.send(savedResource);
      }).catch((error) => {
        res.status(500).send(error);
      });
  });

router.route('/:id')

  // Get resource by id
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

  // Update resource by id
  .put((req, res) => {
    Resource.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // Fetch resource object and send
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

  // Delete resource by id
  .delete((req, res) => {
    Resource.deleteOne({ _id: req.params.id })
      .then(() => {
        res.send(`Resource with id: ${req.params.id} was successfully deleted`);
      })
      .catch((error) => {
        res.send(error);
      });
  });

export default router;
