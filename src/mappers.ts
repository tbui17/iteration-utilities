import mapValues from "lodash/mapValues"


/**
 * Iterates over an array, applying a provided function to each element. If the function returns a defined value, that value is pushed into a result array. This filters out undefined values from the transformation.
 *
 * @param {TValue[]} items - The array of items to process.
 * @param {(item: TValue) => TReturn | undefined} fn - A function that takes an item of the array and returns a new value or undefined.
 * @returns {TReturn[]} An array of transformed items where the transformation function returned a defined value.
 * @template TValue - The type of elements in the input array.
 * @template TReturn - The type of elements in the returned array.
 */
export function mapFilter<TValue extends any[], TReturn>(
	items: TValue,
	fn: (item: TValue[number]) => TReturn
) {
	const result: TReturn[] = []
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const res = fn(item!)
		if (res !== undefined) {
			result.push(res)
		}
	}
	return result as Exclude<TReturn, undefined>[]
}

/**
 * Iterates over an array, applying a provided function to each element, and returns the first defined value returned by the function. If all function calls return undefined, the function itself returns undefined.
 *
 * @param {TValue[]} items - The array of items to process.
 * @param {(item: TValue) => TReturn | undefined} fn - A function that takes an item of the array and returns a new value or undefined.
 * @returns {TReturn | undefined} The first transformed value where the function returns a defined value, or undefined if no such value is found.
 * @template TValue - The type of elements in the input array.
 * @template TReturn - The type of elements that the function can potentially return.
 */
export function mapFind<TValue, TReturn>(
	items: TValue[],
	fn: (item: TValue) => TReturn | undefined
): TReturn | undefined {
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const res = fn(item!)
		if (res !== undefined) {
			return res
		}
	}
	return
}

/**
 * Defines a type for the entries of the mapGroups function, representing a record where each key is associated with a function that takes an item and returns any value.
 *
 * @typedef {Record<string, (item: T[number]) => any>} MapGroupEntries
 * @template T - An array type representing the items that will be passed to each function in the record.
 */
export type MapGroupEntries<T extends any[] = any[]> = Record<
	string,
	(item: T[number]) => any
>

/**
 * Takes an array and a set of functions defined in an object. Each function in the object is applied to all items in the array, creating a new object where each key corresponds to the keys in the input object and the values are arrays of the defined values returned by each function.
 *
 * @param {TItems} items - The array of items to process.
 * @param {TMapGroupEntries} fns - An object where each key is associated with a function that processes items of the array.
 * @returns {{ [K in keyof TMapGroupEntries]: Exclude<ReturnType<TMapGroupEntries[K]>, undefined>[] }} An object where each key corresponds to the input object's keys and the values are arrays of the results returned by the corresponding function, excluding undefined.
 * @template TItems - The type of the array elements.
 * @template TMapGroupEntries - The type of the object containing the transformation functions.
 */
export function mapGroups<
	TItems extends any[],
	TMapGroupEntries extends MapGroupEntries<TItems>
>(
	items: TItems,
	fns: TMapGroupEntries
): {
	[K in keyof TMapGroupEntries]: Exclude<
		ReturnType<TMapGroupEntries[K]>,
		undefined
	>[]
} {
	return mapValues(fns, (fn) => mapFilter(items, fn))
}

/**
 * Partitions an array of items based on a set of filtering functions.
 * Each item is matched against the filtering functions, and if a match is found,
 * the item is added to the corresponding collection
 *
 * If no match is found, the item is added to the orphans collection.
 *
 * On conflicts, the key order of the filtering functions in the object is used to determine priority.
 *
 * @template TItems - The type of the input array.
 * @template TPartitionFunctions - The type of the filtering functions.
 * @param {TItems[]} items - The array of items to be partitioned.
 * @param {TPartitionFunctions} fns - The filtering functions used for partitioning.
 * @returns {{
 *   result: {
 *     [K in keyof TPartitionFunctions]: Exclude<ReturnType<TPartitionFunctions[K]>, undefined>[]
 *   },
 *   orphans: TItems[]
 * }} - An object containing the partitioned collections and the orphans collection.
 */
export function mapPartition<TItems extends any[], TPartitionFunctions extends MapGroupEntries<TItems>>(
	items: TItems,
	fns: TPartitionFunctions
) {
	const collection = mapValues(fns, (mapper) => {
		return {
			mapper,
			collection: [] as unknown[],
		}
	})

	const values = Object.values(collection)
	const orphans = [] as unknown as TItems

	function match(item: unknown) {
		for (const entry of values) {
			const res = entry.mapper(item)
			if (res !== undefined) {
				entry.collection.push(res)
				return true
			}
		}
	}

	for (const item of items) {
		const didMatch = match(item)
		if (!didMatch) {
			orphans.push(item)
		}
	}

	return {
		result: mapValues(collection, (entry) => entry.collection),
		orphans,
	} as {
		result: {
			[K in keyof TPartitionFunctions]: Exclude<ReturnType<TPartitionFunctions[K]>, undefined>[]
		}
		orphans: TItems
	}
}
/**
 * Maps a tuple to an object using the provided enums.
 *
 * @template TTuple - The type of the input tuple.
 * @template TEnums - The type of the enums object.
 * @param {TTuple} tuple - The input tuple.
 * @param {TEnums} enums - The enums object used for mapping.
 * @returns {TupleToObject<TTuple, TEnums>} - The mapped object.
 */
export function mapTupleToObject<
	TTuple extends Readonly<any[]>,
	TEnums extends Record<string, any>
>(tuple: TTuple, enums: TEnums) {
	const result = {} as TupleToObject<TTuple, TEnums>

	for (const key in enums) {
		const tupleIndex = enums[key]
		const tupleValue = tuple[tupleIndex]
		result[key] = tupleValue
	}

	return result
}
export type TupleToObject<
	TTuple extends readonly any[],
	TEnums extends Record<string, any>
> = {
		-readonly [TEnumKey in keyof TEnums as number extends TEnumKey // remove any keys that are numbers to prevent [x:number]:unknown from appearing
		? never : TEnumKey]: TTuple[TEnums[TEnumKey]];
	};

