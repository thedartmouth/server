import Resource from '../models/resource_model';

// eslint-disable-next-line import/prefer-default-export
export function search(query, filters, sort, page, numPerPage) {
  return new Promise((resolve, reject) => {
    // Resource.find({ $query: {}, $orderby: { title: 1 }, $range: [(page - 1) * numPerPage, page * numPerPage] }).then((results) => { // sort === 'a' ? -1 : 1
    Resource.find(query ? {
      $or: [
        { title: query },
        { description: query },
      ],
    } : {})
      .sort({ title: sort === 'a' ? -1 : 1 })
      .skip((page - 1) * numPerPage)
      .limit(numPerPage)
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
