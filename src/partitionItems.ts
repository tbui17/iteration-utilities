import mapValues from "lodash/mapValues"
import { type z } from "zod"
import partial from "lodash/partial"

/**
 * Partitions a collection of items into groups based on a set of Zod schemas.
 * Items are tested against each schema and grouped accordingly. Items that don't match any schema are classified as orphans.
 * 
 * Note that zod schemas strip away extra properties by default unless z.passthrough() is used.
 *
 * @template TPattern - A record type where each key corresponds to a Zod schema.
 * @template TItem - The type of items in the input array.
 * 
 * @param {TItem[]} items - The array of items to be partitioned.
 * @param {TPattern} patterns - An object where each key is associated with a Zod schema. These schemas are used to classify items.
 * @param {Object} [options={}] - Optional configuration options.
 * @param {boolean} [options.prioritizeByKeyOrderOnConflict=false] - Determines the behavior when an item matches multiple schemas.
 * If false, the item is added to all matching groups. If true, the item is added to the first matching group based on key order.
 * 
 * @returns {ReturnType<TPattern, TItem>} An object with two properties: 'result' and 'orphans'.
 * The 'result' property is an object mirroring the structure of 'patterns', but with each schema's key associated with an array of items that matched that schema.
 * The 'orphans' property is an array of items that did not match any schema.
 *
 * @example
 * // Example usage
 * const items = [{ type: 'fruit', name: 'apple' }, { type: 'vegetable', name: 'carrot' }];
 * const patterns = {
 *   fruit: z.object({ type: z.literal('fruit') }),
 *   vegetable: z.object({ type: z.literal('vegetable') })
 * };
 * const partitioned = partitionItems(items, patterns);
 * console.log(partitioned.result.fruit); // [{ type: 'fruit', name: 'apple' }]
 * console.log(partitioned.result.vegetable); // [{ type: 'vegetable', name: 'carrot' }]
 * console.log(partitioned.orphans); // []
 */

export function partitionItems<
	TPattern extends Record<string, z.ZodTypeAny>,
	TItem
>(
	items: TItem[],
	patterns: TPattern,
	{
		prioritizeByKeyOrderOnConflict = false,
	}: {
		prioritizeByKeyOrderOnConflict?: boolean
	} = {}
): ReturnType<TPattern, TItem> {
	const collection = mapValues(patterns, (schema) => {
		return {
			schema,
			collection: [] as unknown[],
		}
	})

	const values = Object.values(collection)
	const orphans: TItem[] = []

	const match = partial(
		prioritizeByKeyOrderOnConflict ? attemptPushMatch : matchAll,
		values
	)

	for (const item of items) {
		const didMatch = match(item)
		if (!didMatch) {
			orphans.push(item)
		}
	}

	return {
		result: mapValues(collection, (entry) => entry.collection),
		orphans,
	} as ReturnType<TPattern, TItem>
}

type ReturnType<TPattern extends Record<string, z.ZodTypeAny>, TItem> = {
	result: {
		[K in keyof TPattern]: z.infer<TPattern[K]>[]
	}
	orphans: TItem[]
}

type MatchStrategy = <TItem>(
	values: { schema: z.ZodTypeAny; collection: TItem[] }[],
	item: TItem
) => boolean | undefined

const attemptPushMatch: MatchStrategy = (values, item) => {
	for (const entry of values) {
		const res = entry.schema.safeParse(item)
		if (res.success) {
			entry.collection.push(res.data)
			return true
		}
	}
}

const matchAll: MatchStrategy = (values, item) => {
	let didMatch = false
	for (const entry of values) {
		const res = entry.schema.safeParse(item)
		if (res.success) {
			entry.collection.push(res.data)
			didMatch = true
		}
	}
	return didMatch
}

