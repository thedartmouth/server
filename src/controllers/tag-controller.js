import { getClient } from '../db'

async function getTag(slug) {
	const dbClient = await getClient()
	const res = (
		await dbClient.query('SELECT * FROM tags WHERE slug = $1 LIMIT 1', [slug])
	).rows[0]
	if (!res) {
		await dbClient.query('INSERT INTO tags (slug) VALUES ($1)', [slug])
	} else {
		return res
	}
}

async function getName(slug) {
	const { name } = await getTag(slug)
	if (!name) {
		throw new Error(`Tag with slug ${slug} name is not set.`)
	} else {
		return name
	}
}

export default { getTag, getName }
