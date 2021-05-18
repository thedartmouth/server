import axios from 'axios'
import { CEO_URLS } from '../modules/ceo'
import cleanArticles from '../modules/clean-articles'

// this is tested
// uses selection sort to merge an array of arrays together
// usable for author feed or tag feed merging
// * ideally should be replaced with a staged heapsort, but it won't affect runtime by more than ~5%
// * since our bottleneck is the API requests anyway, and our "n" value is bounded:
// * (runtime m log n, where m is number of articles and n is number of authors, n won't be large so n ~ logn)
function selectionMerge(arraysToMerge) {
	// array tracks the actual items
	const sortedArray = []
	// use a set to make sure that articles are unique
	const UUIDSet = new Set()
	// calculate number of items => number of iterations
	const numItems = arraysToMerge.reduce((val, subArr) => {
		return val + subArr.items.length
	}, 0)
	// select the most recent article from the 4 arrays as queues
	for (let i = 0; i < numItems; i += 1) {
		// extract the most recent item from the arrays
		const lowestIdx = arraysToMerge.reduce(
			(lowIdx, subArr, currIdx, bigArr) => {
				// nth list is empty
				if (!subArr.items[0]) {
					return lowIdx
				} else if (
					!bigArr[lowIdx].items[0] ||
					subArr.items[0].created_at > bigArr[lowIdx].items[0].created_at
				) {
					return currIdx
				} else {
					return lowIdx
				}
			},
			0
		)
		// remove the item from the right array
		const lowestItem = arraysToMerge[lowestIdx].items.shift()
		const { uuid } = lowestItem
		// check uniqueness constraint against the set
		if (!UUIDSet.has(uuid)) {
			UUIDSet.add(uuid)
			// add it to the compiled list if UUID is new
			sortedArray.push(lowestItem)
		}
	}
	return sortedArray
}

// this is tested well
async function fetchParallel(array, AuthorsOrTags) {
	if (AuthorsOrTags !== 'Authors' && AuthorsOrTags !== 'Tags') {
		throw new Error('second parameter must be "Authors" or "Tags"')
	}
	try {
		// send several requests in parallel
		const alldata = await Promise.all(
			array.map(async ({ name }) => {
				// encode http spaces
				name.replace(' ', '+')
				const resp = {} // await axios.get(fetchURL[AuthorsOrTags] + name)
				return resp.data
			})
		)
		// merge and return the data
		// ! depending on what the frontend needs, this data can be
		// ! further pruned later
		return selectionMerge(alldata)
	} catch (error) {
		console.log(error)
		throw error
	}
}

// this is tested for authors, tags await testing but should work too
async function fetchFollowingFeed(user, AuthorsOrTags) {
	if (AuthorsOrTags !== 'Authors' && AuthorsOrTags !== 'Tags') {
		throw new Error('second parameter must be "Authors" or "Tags"')
	}
	try {
		const populatedUser = await user
			.populate(`followed${AuthorsOrTags}`, 'name')
			.execPopulate()
		// console.log(populatedUser);
		const following = populatedUser[`followed${AuthorsOrTags}`]
		// console.log(following);
		const output = await fetchParallel(following, AuthorsOrTags)
		return cleanArticles(output)
	} catch (error) {
		throw error
	}
}

export default { fetchFollowingFeed }
