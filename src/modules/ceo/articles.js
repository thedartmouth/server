import axios from 'axios'
import { CEO_URLS } from './urls'

export async function fetchArticle(articleSlug) {
	try {
		const res = await axios.get(CEO_URLS.articleSlug(articleSlug))
		switch (res.status) {
			case 200:
				return res.data.article
			case 404:
				return null
			default:
				throw new Error(`Error fetching article by slug, ${res.statusText}`)
		}
	} catch (e) {
		throw new Error(`Error fetching article by slug, ${e}`)
	}
}
