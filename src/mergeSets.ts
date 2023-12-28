/**
 * Merges multiple sets into a single set.
 * @param sets - An array of sets or an iterable of sets to be merged.
 * @returns A new set containing all the unique elements from the input sets.
 * @template T - The type of elements in the sets.
 */
export function mergeSets<T>(sets: Set<T>[] | Iterable<Set<T>>) {
	const coercedSets = Array.isArray(sets) ? sets : [...sets]
	if (coercedSets.length === 0) {
		return new Set<T>()
	}
	return coercedSets.reduce((acc, curr) => {
		return new Set([...acc, ...curr])
	})
}
