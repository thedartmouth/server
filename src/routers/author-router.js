import express from 'express';
import { authorController } from '../controllers';
import { requireAuth } from '../authentication';

const authorRouter = express();

authorRouter.route('/search')
  /*
   * GET /author/search?authorName=...
   * query any author name to get an author document back containing the slug
   * if no author found, 404
   */
  .get(async (req, res) => {
    try {
      const result = await authorController.searchByName(req.query.authorName);
      if (!result) {
        res.status(404).send('author not found');
      } else {
        res.json(result);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('error searching author by name');
    }
  });

authorRouter.route('/profile/:slug')
  /*
   * GET /authors/profile/:slug
   * grab an author's profile using their slug
   *
   * returns name, slug, totalArticles, totalViews, followerCount, and
   * articles which is an array of JSON api articles
   */
  .get(async (req, res) => {
    try {
      const result = await authorController.getProfileBySlug(req.params.slug);
      if (!result) {
        res.status(404).send('no author with this slug found');
      } else {
        res.json(result);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('error querying author profile');
    }
  })

  /*
   * PUT /authors/profile/:slug
   * follows or unfollows an author by slug
   * needs a req body containing "follow": boolean
   *
   * returns a message containing slug and isFollowing
   */
  .put(requireAuth, async (req, res) => {
    try {
      const result = await authorController.toggleFollowingBySlug(req.params.slug, req.user, req.body.follow);
      if (!result) {
        res.status(404).send('no author with this slug found');
      } else {
        res.json(result);
      }
    } catch (error) {
      console.log(error);
      res.status(500).send('error following/defollowing author');
    }
  });

export default authorRouter;
