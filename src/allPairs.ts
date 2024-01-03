/**
 * Executes a callback function for each pair of elements in an array.
 * The callback function receives the left and right elements, their indices, and the original array.
 *
 * @template T - The type of elements in the array.
 * @param items - The array of elements.
 * @param cb - The callback function to execute for each pair of elements.
 */
export function allPairsEach<T>(
	items: T[],
	cb: (a: T, b: T, i: number, j: number, items: T[]) => void
): void {
	for (let i = 0; i < items.length; i++) {
		const left = items[i]!
		for (let j = i + 1; j < items.length; j++) {
			const right = items[j]!
			cb(left, right, i, j, items)
		}
	}
}

/**
 * Applies a callback function to each pair of elements in an array.
 *
 * @template T The type of the elements in the array.
 * @template R The type of the result returned by the callback function.
 * @param items An array of elements.
 * @param cb A callback function that takes two elements, their indices, and the original array as arguments and returns a result.
 * @returns An array of results obtained by applying the callback function to each pair of elements.
 */
export function allPairsMap<T, R>(
	items: T[],
	cb: (a: T, b: T, i: number, j: number, items: T[]) => R
): R[] {
	const result: R[] = []

	for (let i = 0; i < items.length; i++) {
		const left = items[i]!
		for (let j = i + 1; j < items.length; j++) {
			const right = items[j]!
			const res = cb(left, right, i, j, items)
			result.push(res)
		}
	}
	return result
}

/**
 * Applies a callback function to each pair of elements in an array,
 * and returns an array of the results.
 *
 * Return undefined in the callback function to exclude the entry.
 *
 * @template T - The type of the elements in the input array.
 * @template R - The type of the elements in the resulting array.
 * @param items - The input array.
 * @param cb - The callback function to apply to each pair of elements.
 *   It takes two elements from the input array, their indices, and the entire input array as parameters,
 *   and returns the result of the computation, or undefined if no result is produced.
 * @returns An array of the results of applying the callback function to each pair of elements.
 */
export function allPairsMapFilter<T, R>(
	items: T[],
	cb: (a: T, b: T, i: number, j: number, items: T[]) => R | undefined
): R[] {
	const result: R[] = []

	for (let i = 0; i < items.length; i++) {
		const left = items[i]!
		for (let j = i + 1; j < items.length; j++) {
			const right = items[j]!
			const res = cb(left, right, i, j, items)
			if (res !== undefined) {
				result.push(res)
			}
		}
	}
	return result
}
