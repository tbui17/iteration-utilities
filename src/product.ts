/**
 * Returns an array of tuples representing the Cartesian product of two arrays.
 * Each tuple contains an element from the first array and an element from the second array.
 *
 * @template T The type of elements in the first array.
 * @template U The type of elements in the second array.
 * @param {T[]} a The first array.
 * @param {U[]} b The second array.
 * @returns {Array<[T, U]>} An array of tuples representing the Cartesian product of the two arrays.
 */
export function product<T, U>(a: T[], b: U[]): Array<[T, U]> {
	const result: Array<[T, U]> = []

	for (const itemA of a) {
		for (const itemB of b) {
			result.push([itemA, itemB])
		}
	}

	return result
}
