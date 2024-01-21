import groupBy from "lodash/groupBy"
import omit from "lodash/omit"
import mapValues from "lodash/mapValues"
import toString from "lodash/toString"

import { ExcludeMethods } from "@tbui17/type-utils"

/**
 * Groups an array of objects by a composite key derived from specified object keys and returns a new object with these keys omitted.
 *
 * The function works by first creating a unique key for each object in the array by concatenating the string representations of the specified keys' values.
 * Then, it groups the objects based on these composite keys. Finally, it omits the specified keys from each object in the grouped result.
 *
 * The function is generic and can be used with any object type, provided the keys specified are part of the object and do not include methods.
 *
 * @template T - The type of objects in the input array. Should be a record type.
 * @template TKeys - The type of the array of keys to group by and omit. Must be a readonly array of keys of T.
 *
 * @param {T[]} data - The array of objects to group and modify.
 * @param {TKeys} omitKeys - An array of keys to be used for creating the group key and to be omitted in the result.
 * @returns {Record<string, Omit<T, TKeys[number]>[]>} An object where each key is a composite key derived from the `omitKeys` values and each value is an array of objects with the specified keys omitted.
 *
 * @example
 * // Grouping by 'name' and omitting 'name' key in the result
 * groupByOmit([{ id: 1, name: 'Alice', age: 30 }, { id: 2, name: 'Bob', age: 40 }, { id: 3, name: 'Alice', age: 35 }], ['name'])
 * // Returns: { 'Alice': [{ id: 1, age: 30 }, { id: 3, age: 35 }], 'Bob': [{ id: 2, age: 40 }] }
 */
export function groupByOmit<
	T extends Record<string, unknown>,
	TKeys extends Readonly<(keyof ExcludeMethods<T>)[]>,
>(data: T[], omitKeys: TKeys): Record<string, Omit<T, TKeys[number]>[]> {
	const createKey = (item: T) => {
		return omitKeys.map((key) => toString(item[key])).join("")
	}
	const grouped = groupBy(data, createKey)
	return mapValues(grouped, (value) => {
		return value.map((item) => omit(item, omitKeys))
	})
}
