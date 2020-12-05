const fetchURL = {
    Authors:
        'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&au=',
    AuthorsLite:
        'https://www.thedartmouth.com/search.json?a=1&per_page=1&ty=article&au=',
    AuthorSlug: 'https://www.thedartmouth.com/staff/', // remember to append .json every time
    Tags:
        'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&tg=',
    Keywords:
        'https://www.thedartmouth.com/search.json?a=1&per_page=100&ty=article&s=',
    Slug: 'https://www.thedartmouth.com/article/', // remember to append .json every time
}

export default fetchURL
