/**
 * Applies a function to each sliding window of elements in the array.
 *
 * @template T - The type of elements in the items array.
 * @param {T[]} items - The array of items to process.
 * @param {(items: T[], start: number, collection: T[]) => void} fn - The function to apply to each sliding window.
 * @param {{ start?: number, windowSize?: number, increments?: number }} [options={ start: 0, windowSize: 2, increments: 1 }] - The options for sliding window (start index, window size, and increments).
 */

export function slidingWindowEach<T>(
	items: T[],
	fn: (items: T[], start: number, collection: T[]) => void,
	{ start = 0, windowSize = 2, increments = 1 } = {}
): void {
	for (let i = start; i <= items.length - windowSize; i += increments) {
		const last = i + windowSize
		const window = items.slice(i, last)
		fn(window, i, items)
	}
}

/**
 * Maps each sliding window of elements in the array to a new value.
 *
 * @template T - The type of elements in the items array.
 * @template R - The type of the elements returned by the function.
 * @param {T[]} items - The array of items to process.
 * @param {(items: T[], start: number, collection: T[]) => R} fn - The function to apply to each sliding window that returns a new value.
 * @param {{ start?: number, windowSize?: number, increments?: number }} [options={ start: 0, windowSize: 2, increments: 1 }] - The options for sliding window (start index, window size, and increments).
 * @returns {R[]} - An array of results produced by the mapping function.
 */
export function slidingWindowMap<T, R>(
	items: T[],
	fn: (items: T[], start: number, collection: T[]) => R,
	{ start = 0, windowSize = 2, increments = 1 } = {}
): R[] {
	const result: R[] = []

	for (let i = start; i <= items.length - windowSize; i += increments) {
		const last = i + windowSize
		const window = items.slice(i, last)
		const res = fn(window, i, items)
		result.push(res)
	}
	return result
}

/**
 * Filters sliding windows of elements in the array based on a predicate function.
 *
 * @template T - The type of elements in the items array.
 * @param {T[]} items - The array of items to process.
 * @param {(items: T[], start: number, collection: T[]) => boolean} fn - The function to test each sliding window.
 * @param {{ start?: number, windowSize?: number, increments?: number }} [options={ start: 0, windowSize: 2, increments: 1 }] - The options for sliding window (start index, window size, and increments).
 * @returns {T[][]} - An array of sliding windows that pass the test implemented by the provided function.
 */

export function slidingWindowFilter<T>(
	items: T[],
	fn: (items: T[], start: number, collection: T[]) => boolean,
	{ start = 0, windowSize = 2, increments = 1 } = {}
): T[][] {
	const result: T[][] = []

	for (let i = start; i <= items.length - windowSize; i += increments) {
		const last = i + windowSize
		const window = items.slice(i, last)
		if (fn(window, i, items)) {
			result.push(window)
		}
	}
	return result
}

/**
 * Maps each sliding window of elements in the array to a new value and filters out undefined results.
 *
 * @template T - The type of elements in the items array.
 * @template R - The type of the elements returned by the function.
 * @param {T[]} items - The array of items to process.
 * @param {(items: T[], start: number, collection: T[]) => R | undefined} fn - The function to apply to each sliding window that returns a new value or undefined.
 * @param {{ start?: number, windowSize?: number, increments?: number }} [options={ start: 0, windowSize: 2, increments: 1 }] - The options for sliding window (start index, window size, and increments).
 * @returns {R[]} - An array of non-undefined results produced by the mapping function.
 */
export function slidingWindowMapFilter<T, R>(
	items: T[],
	fn: (items: T[], start: number, collection: T[]) => R | undefined,
	{ start = 0, windowSize = 2, increments = 1 } = {}
): R[] {
	const result: R[] = []

	for (let i = start; i <= items.length - windowSize; i += increments) {
		const last = i + windowSize
		const window = items.slice(i, last)
		const res = fn(window, i, items)
		if (res !== undefined) {
			result.push(res)
		}
	}
	return result
}
