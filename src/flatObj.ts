import { type Spread, type Primitive } from "type-fest"
import { type O } from "ts-toolbelt"

type FlatObjResult<
	T extends Record<string, any>,
	K extends keyof T,
> = T[K] extends Primitive
	? T
	: T[K] extends any[]
		? T[K][number] extends Record<string, any>
			? Spread<Omit<T, K>, T[K][number]>[]
			: O.Update<T, K, T[K][number]>[]
		: T[K] extends Record<string, any>
			? Spread<Omit<T, K>, T[K]>
			: never

/**
 * Flattens a nested object or an array of objects based on a specified key.
 * The function 'pulls down' properties from the nested object or objects
 * in an array into the parent object. This is particularly useful for
 * flattening data structures with nested objects or arrays.
 *
 * Behavior:
 * - If the targeted property (`key`) of the object is a primitive value, the original object is returned (do nothing).
 * - If the targeted property is an object, the properties of this nested object are merged into the parent object.
 * - If the targeted property is an array of objects, each object in the array is merged with the parent object, resulting in an array of merged objects.
 * - On key conflicts, the properties of the nested object take precedence over the properties of the parent object.
 * - If the targeted property is an array of primitives, each primitive value is added to a copy of the parent object under the original property key.
 * - The function also handles arrays of objects, applying the flattening to each object in the array.
 *
 *
 * @template T - The type of the object or array of objects to be flattened.
 * @template K - The key of the property in object T to be flattened.
 * @param {T[] | T} obj - The object or array of objects to be flattened.
 * @param {K} key - The key of the property to flatten.
 * @returns {FlatObjResult<T, K>} - The flattened object or array of objects.
 *
 * @example
 * // Flattening a single object with a nested object
 * const obj = { prop1: 1, data: { prop2: "value1" } };
 * const flat = flatObj(obj, "data");
 * // Result: { prop1: 1, prop2: "value1" }
 *
 * @example
 * // Flattening an object with a nested array
 * const obj = { prop1: 1, data: [{ prop2: "value1" }, { prop2: "value2" }] };
 * const flat = flatObj(obj, "data");
 * // Result: [{ prop1: 1, prop2: "value1" }, { prop1: 1, prop2: "value2" }]
 *
 * @example
 * // Flattening an array of objects with nested arrays
 * const objs = [{ prop1: 1, data: ["a", "b"] }, { prop1: 2, data: ["c", "d"] }];
 * const flatArray = flatObj(objs, "data");
 * // Result: [{ prop1: 1, data: "a" }, { prop1: 1, data: "b" }, { prop1: 2, data: "c" }, { prop1: 2, data: "d" }]
 */
export function flatObj<T extends Record<string, any>, K extends keyof T>(
	obj: T[] | T,
	key: K
): FlatObjResult<T, K> {
	if (Array.isArray(obj)) {
		return obj
			.map((singleObj) => pullDown(singleObj, key))
			.flat() as FlatObjResult<T, K>
	}
	return pullDown(obj, key) as FlatObjResult<T, K>
}

function pullDown<T extends Record<string, any>, K extends keyof T>(
	obj: T,
	key: K
): any {
	const collection = obj[key]
	if (!Array.isArray(collection)) {
		if (typeof collection === "object" && collection !== null) {
			const { [key]: _excluded, ...rest } = obj
			return { ...rest, ...collection }
		}
		return obj
	}
	const { [key]: _excluded, ...rest } = obj

	return collection.map((item: unknown) => {
		if (typeof item === "object" && item !== null) {
			return { ...rest, ...item }
		}
		return { ...rest, [key]: item }
	})
}
