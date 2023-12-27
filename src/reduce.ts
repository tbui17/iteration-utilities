/**
 * Reduces an array of elements into a multi-object based on a provided mapping function.
 * The mapping function should return an array of key-value pairs, where the key represents the property name in the resulting multi-object,
 * and the value represents the corresponding value to be added to the array of values for that property.
 *
 * @template T The type of elements in the collection.
 * @template TReturn The type of the values in the resulting multi-object.
 * @template TAssignment The type of the key-value pairs returned by the mapping function.
 * @param {T[]} collection The array of elements to be reduced.
 * @param {(curr: T, i: number, collection: T[]) => TAssignment | undefined} fn The mapping function.
 * @returns {{ [K in TAssignment[0]]?: TAssignment[1][] }} The resulting multi-object.
 */
export const reduceToMultiObject = <
	const T,
	const TReturn,
	const TAssignment extends [Readonly<PropertyKey>, TReturn]
>(
	collection: T[],
	fn: (curr: T, i: number, collection: T[]) => TAssignment | undefined
): { [K in TAssignment[0]]?: TAssignment[1][] } => {
	const map = {} as { [K in TAssignment[0]]: TAssignment[1][] }
	for (let i = 0; i < collection.length; i++) {
		const res = fn(collection[i]!, i, collection)
		if (res !== undefined) {
			const [key, value] = res
			const arr = map[key as keyof typeof map] ?? []

			arr.push(value)
			map[key as keyof typeof map] = arr
		}
	}
	return map
}

/**
 * Reduces an array to an object using a mapping function.
 *
 * @template T - The type of elements in the array.
 * @template TReturn - The type of the value returned by the mapping function.
 * @template TAssignment - The type of the assignment tuple returned by the mapping function.
 * @param collection - The array to be reduced.
 * @param fn - The mapping function that transforms each element of the array into an assignment tuple.
 * @returns An object where the keys are the first elements of the assignment tuples and the values are the second elements.
 */
export function reduceToObject<
	const T,
	const TReturn,
	const TAssignment extends [Readonly<PropertyKey>, TReturn]
>(
	collection: T[],
	fn: (curr: T, i: number, collection: T[]) => TAssignment | undefined
): { [K in TAssignment[0]]?: TAssignment[1] } {
	const map = {} as Record<TAssignment[0], TAssignment[1]>
	for (let i = 0; i < collection.length; i++) {
		const res = fn(collection[i]!, i, collection)
		if (res === undefined) {
			continue
		}
		const [key, value] = res
		map[key as keyof typeof map] = value
	}
	return map
}
