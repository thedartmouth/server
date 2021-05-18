const CEO_BASE_URL = 'https://www.thedartmouth.com'

export const CEO_URLS = {
	articleSlug: (slug) => `${CEO_BASE_URL}/article/${slug}.json`,
	authorSearch: (query) =>
		`${CEO_BASE_URL}/search.json?a=1&per_page=100&ty=article&au=${query}`,
	authorSlug: (slug) => `${CEO_BASE_URL}/staff/${slug}.json`,
	tagSearch: (query) =>
		`${CEO_BASE_URL}/search.json?a=1&per_page=100&ty=article&tg=${query}`,
	keywordSearch: (query) =>
		`${CEO_BASE_URL}/search.json?a=1&per_page=100&ty=article&s=${query}`,
}
