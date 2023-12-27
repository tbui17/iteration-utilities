export function mergeSets<T>(sets: Set<T>[] | Iterable<Set<T>>) {
	const coercedSets = Array.isArray(sets) ? sets : [...sets]
	return coercedSets.reduce((acc, curr) => {
		return new Set([...acc, ...curr])
	})
}
