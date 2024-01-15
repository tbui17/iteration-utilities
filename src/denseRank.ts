import isEqual from "lodash/isEqual"
import orderBy from "lodash/orderBy"

/**
 * Performs a dense ranking on an array of items based on specified iteratees and orders.
 * Each item in the array is assigned a rank, with identical items receiving the same rank.
 * The rank is added to each item in a new field specified by the fieldName parameter.
 *
 * @template T The type of the items in the array.
 * @template TRankField The type of the field name where the rank will be stored.
 *
 * @param {T[] | ReadonlyArray<T>} items - The array of items to be ranked.
 * @param {((item: T) => unknown)[]} iteratees - An array of functions for producing the criteria by which to rank items.
 * @param {Object} [options] - Optional settings for the ranking.
 * @param {("desc" | "asc")[]} [options.orders=[]] - The order to sort for each iteratee, defaults to ascending order.
 * @param {TRankField} [options.fieldName="rank"] - The name of the field to store the rank in each item, defaults to "rank".
 * @param {number} [options.startingRank=1] - The rank to start at, defaults to 1.
 *
 * @returns {(T & { [K in TRankField]: number })[]} - The array of items, each augmented with a rank field.
 */
export function denseRank<T, TRankField extends string = "rank">(
	items: T[] | ReadonlyArray<T>,
	iteratees: ((item: T) => unknown)[] | ((item: T) => unknown),
	{
		orders = [],
		fieldName = "rank" as TRankField,
		startingRank = 1,
	}: {
		orders?: ("desc" | "asc")[]
		fieldName?: TRankField
		startingRank?: number
	} = {}
): (T & { [K in TRankField]: number })[] {
	const sortedItems = orderBy(items, iteratees, orders)

	let lastRank = startingRank
	let lastValues: unknown[] = []
	iteratees = Array.isArray(iteratees) ? iteratees : [iteratees]

	const valueFactory = (item: T) => {
		return iteratees.map((selector) => selector(item))
	}

	return sortedItems.map((item, index) => {
		const currentValues = valueFactory(item)

		if (index > 0 && !isEqual(currentValues, lastValues)) {
			lastRank++
		}

		lastValues = currentValues
		return {
			...item,
			[fieldName]: lastRank,
		} as T & { [K in TRankField]: number }
	})
}
