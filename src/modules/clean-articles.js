// function to trim down output to ~1/6 of its size in bytes
// EDIT: now only trims to 3/4 since we still need body text
// lots of further improvement possible later, if we care about this
export default function cleanArticles(articles) {
	return articles.map((article) => {
		return {
			uuid: article.uuid,
			slug: article.slug,
			headline: article.headline,
			abstract: article.abstract,
			content: article.content,
			media_id: article.media_id,
			published_at: article.published_at,
			metadata: article.metadata,
			hits: article.hits,
			tags: article.tags,
			authors: article.authors,
			dominantMedia: article.dominantMedia,
		}
	})
}
