// function to trim down output to ~1/6 of its size in bytes
// mostly from removing article body text
// lots of further improvement possible later, if we care about this
export default function cleanArticles(articles) {
  return articles.map((article) => {
    return {
      uuid: article.uuid,
      slug: article.slug,
      headline: article.headline,
      abstract: article.abstract,
      media_id: article.media_id,
      published_at: article.published_at,
      metadata: article.metadata,
      hits: article.hits,
      tags: article.tags,
      authors: article.authors,
      dominantmedia: article.dominantmedia,
    };
  });
}
