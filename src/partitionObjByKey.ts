import type { ExcludeMethods, GetMethodKeys } from "@tbui17/type-utils"

/**
 * Partitions an object by keys into two separate objects: one containing the picked keys and their corresponding values,
 * and another containing the remaining keys and their corresponding values.
 *
 * @template T - The type of the object to be partitioned.
 * @template TKeys - The type of the keys to be picked.
 * @param obj - The object to be partitioned.
 * @param keys - The keys to be picked.
 * @returns An array containing two objects: the first object contains the picked keys and their corresponding values,
 *          and the second object contains the remaining keys and their corresponding values.
 */
export function partitionObjByKey<
	T extends object,
	TKeys extends Readonly<(keyof ExcludeMethods<T>)[]>,
>(
	obj: T,
	keys: TKeys
): [
	Pick<T, (typeof keys)[number]>,
	Omit<T, (typeof keys)[number] | GetMethodKeys<T>>,
] {
	const keySet = new Set(keys)
	const picked: Record<string, unknown> = {}
	const remaining: Record<string, unknown> = {}

	for (const key in obj) {
		const val = obj[key]
		if (typeof val === "function") {
			continue
		}
		if (keySet.has(key as unknown as keyof ExcludeMethods<T>)) {
			picked[key] = val
			continue
		}
		remaining[key] = val
	}

	//@ts-expect-error value should match signature
	return [picked, remaining]
}
