/* eslint-disable no-unused-vars */
import { Articles, Users } from '../models'
import { query, getClient } from '../db'

/**
 * Fetches a meta article by slug.
 * @param {String} slug
 */
async function fetchMetaArticle(slug) {
    return query('SELECT * FROM metaArticles WHERE slug=$1', [slug])
}

/**
 * Creates a meta article references by slug.
 */
function createMetaArticle(slug) {
    return query('INSERT INTO metaArticles (slug) VALUES ($1)', [slug])
}

// wrapper around createArticle that also saves it in db
async function createAndSaveArticle(article) {
    const newArticle = createArticle(article)
    await newArticle.save()
    return newArticle
}

// bookmarks an article if it's not been bookmarked, else unbookmarks it
async function bookmarkArticle(userID, articleID) {
    try {
        const user = await Users.findById(userID)
        const article = await Articles.findById(articleID)

        const articleIndex = user.bookmarkedArticles.indexOf(articleID)
        const userIndex = article.bookMarkedUsers.indexOf(userID)

        if (articleIndex > -1 || userIndex > -1) {
            // article is already bookmarked, remove bookmark
            user.bookmarkedArticles.splice(articleIndex, 1)
            article.bookMarkedUsers.splice(userIndex, 1)
        } else {
            user.bookmarkedArticles.push(articleID)
            article.bookMarkedUsers.push(userID)
        }
        const savedUser = await user.save()
        const savedArticle = await article.save()

        return { user: savedUser, article: savedArticle }
    } catch (err) {
        return err.value === userID
            ? { message: 'Invalid userID', error: err }
            : { message: 'Invalid articleID' }
    }
}

async function readArticle(slug, userId) {
    const dbClient = await getClient()

    let metaArticle =
        (
            await dbClient.query('SELECT * FROM metaArticles WHERE slug = $1', [
                slug,
            ])
        ).rows[0] || null
    console.table(metaArticle)
    if (!metaArticle) {
        metaArticle = dbClient.query(
            'INSERT INTO metaArticles (slug) VALUES ($1)',
            [slug]
        )
    }

    await dbClient.query(
        'INSERT INTO reads (articleSlug, userId, timestamp) VALUES ($1, $2, $3)',
        [slug, userId, new Date().toUTCString()]
    )
    await dbClient.query(
        'UPDATE metaArticles SET reads = reads + 1 WHERE slug = $1',
        [slug]
    )
    dbClient.release()
}

// works the same way as processReadArticle
// finds an article and adds the user to the shared list
async function shareArticle(article, user) {
    const dbArticle = await Articles.findById(article.slug)
    if (user) {
        const sharedUser = dbArticle.sharedUsers.find((item) => {
            return user._id.equals(item)
        })
        if (!sharedUser) {
            dbArticle.sharedUsers.push(user._id)
        }
    }
    await dbArticle.save()
    return dbArticle
}

export default {
    createMetaArticle,
    fetchMetaArticle,
    createAndSaveArticle,
    bookmarkArticle,
    readArticle,
    shareArticle,
}
