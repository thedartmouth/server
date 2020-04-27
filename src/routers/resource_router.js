import express from 'express';

import Resource from '../models/resource_model';
import requireAuth from '../authentication/requireAuth';

const router = express();

// find and return all resources
router.route('/')

  // Get all resources
  .get((req, res) => {
    Resource.find({}).then((resources) => {
      return res.send(resources);
    }).catch((error) => {
      return res.status(500).json(error);
    });
  })

  // Create new resource (SECURE)
  .post(requireAuth, (req, res) => {
    const resource = new Resource();

    resource.title = req.body.title;
    resource.description = req.body.description;
    resource.value = req.body.value;
    resource.date_account_created = Date.now();

    resource.save()
      .then((savedResource) => {
        return res.send(savedResource);
      }).catch((error) => {
        return res.status(500).send(error);
      });
  })

  // Delete all resources (SECURE, TESTING ONLY)
  .delete(requireAuth, (req, res) => {
    Resource.deleteMany({ })
      .then(() => {
        return res.send({ message: 'Successfully deleted all resources.' });
      })
      .catch((error) => {
        return res.send(error);
      });
  });

router.route('/:id')

  // Get resource by id
  .get((req, res) => {
    Resource.findById(req.params.id)
      .then((resource) => {
        return res.send(resource);
      })
      .catch((error) => {
        if (error.message && error.message.startsWith('Resource with id:')) {
          return res.status(404).send(error);
        } else {
          return res.status(500).send(error);
        }
      });
  })

  // Update resource by id (SECURE)
  .put(requireAuth, (req, res) => {
    Resource.updateOne({ _id: req.params.id }, req.body)
      .then(() => {
        // Fetch resource object and send
        Resource.findById(req.params.id)
          .then((resource) => {
            return res.send(resource);
          })
          .catch((error) => {
            if (error.message.startsWith('Resource with id:')) {
              return res.status(404).json({ message: error.message });
            } else {
              return res.status(500).json({ message: error.message });
            }
          });
      })
      .catch((error) => {
        return res.status(500).send(error);
      });
  })

  // Delete resource by id, SECURE
  .delete(requireAuth, (req, res) => {
    Resource.deleteOne({ _id: req.params.id })
      .then(() => {
        return res.send({ message: `Resource with id: ${req.params.id} was successfully deleted` });
      })
      .catch((error) => {
        return res.send(error);
      });
  });

export default router;
