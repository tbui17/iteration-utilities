/**
 * Picks specific properties from an object and returns them as an array.
 *
 * @template T - The type of the object.
 * @template TKey - The type of the keys to pick.
 * @template TKeys - The type of the array of keys.
 * @param obj - The object from which to pick properties.
 * @param keys - The keys to pick from the object.
 * @returns An array containing the picked properties.
 */
export function pickToArray<
	T extends object,
	TKey extends keyof T,
	const TKeys extends Readonly<TKey[]>
>(obj: T, keys: TKeys): T[TKeys[number]][] {
	return keys.map((key) => obj[key])
}
