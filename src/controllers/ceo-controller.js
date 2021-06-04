import { query } from '../db'
import notificationController from './notification-controller'
import jwt from 'jsonwebtoken'

async function handleData(token, data) {
	if (!token || !data) return
	console.log(token)
	const { type, action } = jwt.verify(token, process.env.CEO_CONNECTOR_API_KEY)
	console.log('type', type)
	console.log('action', action)
	query(
		'INSERT INTO ceoConnectorData (type, data, timestamp) VALUES ($1, $2, $3)',
		[type, JSON.stringify(data), new Date().toUTCString()]
	)
	switch (type) {
		case 'article':
			const { slug, published_at: publishedAt } = data
			console.log('slug', slug)
			console.log('published_at', publishedAt)
			if (!slug)
				throw new Error(
					'Missing articleSlug in Connector API create event.'
				)
			switch (action) {
				case 'create':
					const exists = (
						await query(
							'SELECT EXISTS(SELECT FROM metaArticles WHERE slug = $1 LIMIT 1)',
							[slug]
						)
					).rows[0].exists
					if (exists) {
						if (!publishedAt) {
							query(
								'UPDATE metaArticles SET published = $1 WHERE slug = $2',
								[false, slug]
							)
						}
					} else {
						query(
							'INSERT INTO metaArticles (slug, published) VALUES ($1, $2)',
							[slug, false]
						)
					}
					break
				case 'update':
					if (publishedAt) {
						const previouslyUnpublished = (
							await query(
								'SELECT published FROM metaArticles WHERE slug = $1 LIMIT 1',
								[slug]
							)
						).rows[0]?.published
						if (previouslyUnpublished === false) {
							query(
								'UPDATE metaArticles SET published = $1 WHERE slug = $2',
								[true, slug]
							)
							notificationController.postArticleNotification(slug)
						}
					}
					break
			}
			break
	}
}

export default { handleData }
