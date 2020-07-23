import express from 'express';
import { authorController } from '../controllers';
import { requireAuth } from '../authentication';

const authorRouter = express();

authorRouter.route('/search')
  /*
   * GET /author/search?authorName=...
   * query any author name to get an author document back containing the slug
   * if no author found, 404
   *
   * WORKS WITHOUT DB ENTRY (will add to db if not found before)
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
   * returns author document, totalViews, and
   * articles which is an array of JSON api articles
   *
   * follower count is in author.followers.length
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
   * returns json containing the updated user, author, and isFollowing boolean
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
