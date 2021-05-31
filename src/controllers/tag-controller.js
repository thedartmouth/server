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

async function rankTags(tagSlugs) {
	if (!tagSlugs) return []

	const dbClient = await getClient()

	const tags = await Promise.all(
		tagSlugs.map(async (slug) => {
			return (
				await dbClient.query(
					'SELECT (slug, rank) FROM tags WHERE slug = $1 AND rank > -1 LIMIT 1',
					[slug]
				)
			).rows[0]
		})
	)
	tags.sort((a, b) => a.rank - b.rank)

	return tags
}

export default { getTag, getName, rankTags }
