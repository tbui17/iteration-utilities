import mapValues from "lodash/mapValues"
import { type z } from "zod"
import partial from "lodash/partial"

/**
 * If two patterns are valid, they are prioritized by their key order in the object.
 *
 * @param items
 * @param patterns
 * @returns
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
) {
	const collection = mapValues(patterns, (schema) => {
		return {
			schema,
			collection: [] as unknown[],
		}
	})

	const values = Object.values(collection)
	const orphans: TItem[] = []

	const match = partial(
		prioritizeByKeyOrderOnConflict ? matchAll : attemptPushMatch,
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
