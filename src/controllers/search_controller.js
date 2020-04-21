import Resource from '../models/resource_model';

// eslint-disable-next-line import/prefer-default-export
export function search(queryObject, sort, page, numPerPage) {
  return new Promise((resolve, reject) => {
    Resource.find(queryObject) // Return all results (within limits) if no query
      .sort({ title: sort === 'a' ? -1 : 1 }) // Sort by title
      .skip((page - 1) * numPerPage) // Start at the beginning of the "page"
      .limit(numPerPage) // Limit to the end of the "page"
      .then((results) => {
        console.log('results', results);
        resolve(results);
      })
      .catch((error) => {
        console.error(error);
        reject(error);
      });
  });
}
