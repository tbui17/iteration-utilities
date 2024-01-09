import { type z } from "zod"
import { postDFSObjectTraversal } from "."

import {
	type SpreadDeepObject,
	type ReplaceDeepObject,
	type ReplaceDeepWithinObject,
	type ExtractObjectsDeep,
} from "@tbui17/type-utils/src"
import cloneDeep from "lodash/cloneDeep"
import { notMatchable } from "./internal/notMatchable"

/**
 * Modifies an object by merging additional properties returned by a callback function
 * onto each nested object that matches a specified Zod pattern. This function performs
 * a post-order depth-first search (DFS) traversal of the object, applying the transformation
 * wherever the pattern matches.
 *
 * *** Ignores any processing done by zod such as stripping away extra properties. ***
 *
 * @template TValue - The type of the object to be processed. Must be an object type.
 * @template TPattern - The Zod type representing the pattern for matching sub-objects
 *   within the object. Must be a Zod type that infers to a record (object) structure.
 * @template TReturn - The type of the object returned by the callback function.
 *   This type's properties are merged into the matching sub-objects.
 *
 * @param {Object} params - The parameters for the function.
 * @param {TValue} params.value - The object to be processed. This object is traversed
 *   to find sub-objects that match the given pattern.
 * @param {TPattern} params.pattern - The Zod pattern used to match sub-objects within
 *   `value`. Sub-objects that match this pattern are transformed by the callback function.
 * @param {(ctx: Record<string, any> & z.infer<TPattern>) => TReturn} params.fn -
 *   A callback function that is invoked for each sub-object matching the pattern.
 *   The function should return an object whose properties will be merged into the
 *   matching sub-object.
 *
 * @returns {SpreadDeepObject<TValue, z.infer<TPattern>, TReturn>} - The modified object.
 *   This type is a complex type that results from recursively applying the transformation
 *   to all matching sub-objects in `value`.
 *
 * See demo fixture in [tests/patternMatch.test.ts](tests/patternMatch.test.ts) for example use.
 */
export function mergeByPattern<
	TValue extends object,
	TPattern extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>,
	TReturn extends Record<string, any>,
>({
	fn,
	value,
	pattern,
	shouldClone = true,
}: {
	value: TValue
	pattern: TPattern
	fn: (
		ctx: Extract<ExtractObjectsDeep<TValue>, z.infer<TPattern>> &
			Record<string, any>
	) => TReturn
	shouldClone?: boolean
}): SpreadDeepObject<TValue, z.infer<TPattern>, TReturn> {
	const obj = shouldClone ? cloneDeep(value) : value

	postDFSObjectTraversal(obj, (ctx) => {
		if (!ctx.isRecord() || notMatchable(ctx.context)) {
			return
		}

		if (!pattern.safeParse(ctx.context).success) {
			return
		}

		Object.assign(ctx.context, fn(ctx.context as any))
	})

	return obj as any
}

/**
 * Modifies an object by replacing each nested object that matches a specified
 * Zod pattern with a new object returned by a callback function.
 *
 * Ignores the root object or array.
 *
 * *** Ignores any processing done by zod such as stripping away extra properties. ***
 *
 * @example
 * 	// Example usage
 * 	const obj = { a: { type: "match", data: 1 }, b: { data: 2 } }
 * 	const pattern = z.object({ type: z.literal("match") })
 * 	const result = replaceByPattern({
 * 		value: obj,
 * 		pattern,
 * 		fn: (ctx) => ({ newData: ctx.data * 2 }),
 * 	})
 * 	console.log(result)
 * 	// Output: { a: { newData: 2 }, b: { data: 2 } }
 *
 * @template TValue - The type of the object to be processed.
 * @template TPattern - The Zod type representing the pattern for matching
 *   sub-objects.
 * @template TReturn - The type of the object returned by the callback function.
 * @param {Object} params - The parameters for the function.
 * @param {TValue} params.value - The object to be processed.
 * @param {TPattern} params.pattern - The Zod pattern used to match sub-objects
 *   within `value`.
 * @param {(ctx: Record<string, any> & z.infer<TPattern>) => TReturn} params.fn
 *   - A callback function that is called for each matching sub-object and returns a
 *       new object to replace it.
 *
 * @returns {TValue extends Array<infer U> ? U extends Record<string, any> ? ReplaceDeepObject<U, z.infer<TPattern>, TReturn>: never: ReplaceDeepWithinObject<TValue, z.infer<TPattern>, TReturn>} - The
 *   modified object with each matching sub-object replaced by the new object
 *   returned by the callback function.
 */
export function replaceByPattern<
	TValue extends object,
	TPattern extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>,
	TReturn extends Record<string, any>,
>({
	fn,
	value,
	pattern,
	shouldClone = true,
}: {
	value: TValue
	pattern: TPattern
	fn: (
		ctx: Extract<ExtractObjectsDeep<TValue>, z.infer<TPattern>> &
			Record<string, any>
	) => TReturn
	shouldClone?: boolean
}): NoRootModification<TValue, TPattern, TReturn> {
	const obj = shouldClone ? cloneDeep(value) : value

	postDFSObjectTraversal(obj, (ctx) => {
		//
		if (!ctx.isRecord() || notMatchable(ctx.context)) {
			return
		}

		if (!pattern.safeParse(ctx.context).success) {
			return
		}

		const newContext = fn(ctx.context as any)

		ctx.replace(newContext)
	})

	return obj as any
}
type NoRootModification<
	TValue extends Record<string, any>,
	TPattern extends z.ZodObject<z.ZodRawShape, z.UnknownKeysParam>,
	TReturn extends Record<string, any>,
> = TValue extends Array<infer U>
	? U extends Record<string, any>
		? ReplaceDeepObject<U, z.infer<TPattern>, TReturn>
		: never
	: ReplaceDeepWithinObject<TValue, z.infer<TPattern>, TReturn>
