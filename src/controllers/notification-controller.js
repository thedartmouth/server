import { query, getClient } from '../db'
import { fireNotification } from '../modules/notifications'

async function postDirect(notification) {
	const dbClient = await getClient()
	if (!!notification.type) throw new Error('missing {type}')
	switch (notification.type) {
		case 'ARTICLE':
			let { title, text, articleSlug } = notification
			if (!!articleSlug) throw new Error('missing {articleSlug}')
			// fetch article from JSON API
			const article = {}
			if (!!text) {
				title = article.title
				text = article.abstract
			} else if (!!title) title = 'The Dartmouth, Inc.'
			await fireNotification(notification)
			dbClient.query('INSERT INTO notifications ()')
		default:
			throw new Error('invalid {type}')
	}
}