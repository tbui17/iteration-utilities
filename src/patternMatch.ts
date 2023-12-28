import isPlainObject from "lodash/isPlainObject"
import { type z } from "zod"
import { postDFSObjectTraversal } from "."

import {
	type SpreadDeepObject,
	type ReplaceDeepObject,
	type ReplaceDeepWithinObject,
} from "@tbui17/type-utils"

/**
 * Modifies an object by spreading additional properties returned by a callback function
 * onto each nested object that matches a specified Zod pattern. This function performs
 * a depth-first search (DFS) traversal of the object, applying the transformation
 * wherever the pattern matches.
 *
 * @template TValue - The type of the object to be processed. Must be an object type.
 * @template TPattern - The Zod type representing the pattern for matching sub-objects
 *   within the object. Must be a Zod type that infers to a record (object) structure.
 * @template TReturn - The type of the object returned by the callback function.
 *   This type's properties are spread onto the matching sub-objects.
 *
 * @param {Object} params - The parameters for the function.
 * @param {TValue} params.value - The object to be processed. This object is traversed
 *   to find sub-objects that match the given pattern.
 * @param {TPattern} params.pattern - The Zod pattern used to match sub-objects within
 *   `value`. Sub-objects that match this pattern are transformed by the callback function.
 * @param {(ctx: Record<string, any> & z.infer<TPattern>) => TReturn} params.fn -
 *   A callback function that is invoked for each sub-object matching the pattern.
 *   The function should return an object whose properties will be spread onto the
 *   matching sub-object.
 *
 * @returns {SpreadDeepObject<TValue, z.infer<TPattern>, TReturn>} - The modified object.
 *   This type is a complex type that results from recursively applying the transformation
 *   to all matching sub-objects in `value`.
 *
 * @example
 * ```typescript
 * // Config object type
 * type DeploymentConfig = {
 *   development: {
 *     server: string;
 *     port: number;
 *     features: {
 *       enableDebug: boolean;
 *       loggingLevel: string;
 *       container: {
 *         name: string;
 *         image: string;
 *       };
 *     };
 *   };
 *   production: {
 *     server: string;
 *     port: number;
 *     features: {
 *       enableDebug: boolean;
 *       loggingLevel: string;
 *       container: {
 *         name: string;
 *         image: string;
 *       };
 *     };
 *   };
 * };
 *
 * // Sample deployment configuration object
 * const deploymentConfigs: DeploymentConfig = {
 *   development: {
 *     server: "dev-server",
 *     port: 8080,
 *     features: {
 *       enableDebug: true,
 *       loggingLevel: "verbose",
 *       container: {
 *         name: "dev-container",
 *         image: "dev-image",
 *       },
 *     },
 *   },
 *   production: {
 *     server: "prod-server",
 *     port: 80,
 *     features: {
 *       enableDebug: false,
 *       loggingLevel: "error",
 *       container: {
 *         name: "prod-container",
 *         image: "prod-image",
 *       },
 *     },
 *   },
 * };
 *
 * // Define a Zod pattern to match objects with certain properties. Can be a partial match.
 * const featuresSchema = z.object({
 *   enableDebug: z.boolean(),
 *   loggingLevel: z.string(),
 * });
 *
 * // Using spreadByPattern to add a monitoringEnabled property
 * const updatedConfig = spreadByPattern({
 *   value: deploymentConfigs,
 *   pattern: featuresSchema,
 *   fn: (ctx) => {
 *     // Adding a monitoringEnabled property based on the enableDebug setting
 *     // Context type is also partially inferred, based on provided schema.
 *     type InferredContextType = Record<string, any> & {
 *       enableDebug: boolean;
 *       loggingLevel: string;
 *     };
 *     return {
 *       monitoringEnabled: ctx.enableDebug,
 *     };
 *   },
 * });
 *
 * // The return type of updatedConfig will be inferred based on the transformation applied:
 * type InferredUpdatedConfigType = {
 *   development: {
 *     server: string;
 *     port: number;
 *     features: {
 *       enableDebug: boolean;
 *       loggingLevel: string;
 *       container: {
 *         name: string;
 *         image: string;
 *       };
 *       monitoringEnabled: boolean;
 *     };
 *   };
 *   production: {
 *     server: string;
 *     port: number;
 *     features: {
 *       enableDebug: boolean;
 *       loggingLevel: string;
 *       container: {
 *         name: string;
 *         image: string;
 *       };
 *       monitoringEnabled: boolean;
 *     };
 *   };
 * };
 *
 * const expectedOutput = {
 *   development: {
 *     server: "dev-server",
 *     port: 8080,
 *     features: {
 *       enableDebug: true,
 *       loggingLevel: "verbose",
 *       monitoringEnabled: true, // Added based on the enableDebug value
 *       container: {
 *         name: "dev-container",
 *         image: "dev-image",
 *       },
 *     },
 *   },
 *   production: {
 *     server: "prod-server",
 *     port: 80,
 *     features: {
 *       enableDebug: false,
 *       loggingLevel: "error",
 *       monitoringEnabled: false, // Added based on the enableDebug value
 *       container: {
 *         name: "prod-container",
 *         image: "prod-image",
 *       },
 *     },
 *   },
 * };
 *
 * expect(updatedConfig).toEqual(expectedOutput);
 * ```
 */
export function spreadByPattern<
	TValue extends object,
	TPattern extends z.ZodType<Record<string, any>>,
	TReturn extends Record<string, any>
>({
	fn,
	value,
	pattern,
}: {
	value: TValue
	pattern: TPattern
	fn: (ctx: Record<string, any> & z.infer<TPattern>) => TReturn
}): SpreadDeepObject<TValue, z.infer<TPattern>, TReturn> {
	postDFSObjectTraversal(value, (ctx) => {
		const { context } = ctx
		if (!ctx.isRecord() || !isPlainObject(context)) {
			return
		}

		if (!pattern.safeParse(context).success) {
			return
		}

		Object.assign(context, fn(context))
	})
	//@ts-expect-error experimental
	return value
}

/**
 * Modifies an object by replacing each nested object that matches a specified
 * Zod pattern with a new object returned by a callback function.
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
 * @returns {ReplaceDeepObject<TValue, z.infer<TPattern>, TReturn>} - The
 *   modified object with each matching sub-object replaced by the new object
 *   returned by the callback function.
 */
export function replaceByPattern<
	TValue extends object,
	TPattern extends z.ZodType<Record<string, any>>,
	TReturn extends Record<string, any>
>({
	fn,
	value,
	pattern,
}: {
	value: TValue
	pattern: TPattern
	fn: (ctx: Record<string, any> & z.infer<TPattern>) => TReturn
}): ReplaceDeepObject<TValue, z.infer<TPattern>, TReturn> {
	postDFSObjectTraversal(value, (ctx) => {
		if (!ctx.isRecord() || !isPlainObject(ctx.context)) {
			return
		}

		const { context } = ctx

		if (!pattern.safeParse(context).success) {
			return
		}

		ctx.replace(fn(context))
	})

	//@ts-expect-error experimental
	return value
}

/**
 * Iterates through an object and replaces values of its properties based on a
 * specified Zod pattern and a callback function.
 *
 * @example
 * 	// Example usage
 * 	const obj = { a: { value: 1 }, b: { value: 2, other: 3 } }
 * 	const pattern = z.object({ value: z.number() })
 * 	const result = replaceValuesWithinObject({
 * 		value: obj,
 * 		pattern,
 * 		fn: ({ context }) => context.value * 10,
 * 	})
 * 	console.log(result)
 * 	// Output: { a: { value: 10 }, b: { value: 20, other: 3 } }
 *
 * @template TValue - The type of the object to be processed.
 * @template TPattern - The Zod type representing the pattern for matching
 *   values within the object.
 * @template TReturn - The type of the value returned by the callback function.
 * @param {Object} params - The parameters for the function.
 * @param {TValue} params.value - The object to be processed.
 * @param {TPattern} params.pattern - The Zod pattern used to match values
 *   within `value`.
 * @param {(ctx: {
 * 	parent: Record<string, any>
 * 	context: z.infer<TPattern>
 * 	key: string
 * }) => TReturn} params.fn
 *   - A callback function that is called for each matching value and returns a new
 *       value to replace it.
 *
 * @returns {ReplaceDeepWithinObject<TValue, z.infer<TPattern>, TReturn>} - The
 *   modified object with each matching value replaced by the new value returned
 *   by the callback function.
 */

export function replaceValuesWithinObject<
	TValue extends object,
	TPattern extends z.ZodTypeAny,
	TReturn
>({
	fn,
	value,
	pattern,
}: {
	value: TValue
	pattern: TPattern
	fn: (ctx: {
		parent: Record<string, any>
		context: z.infer<TPattern>
		key: string
	}) => TReturn
}): ReplaceDeepWithinObject<TValue, z.infer<TPattern>, TReturn> {
	postDFSObjectTraversal(value, (ctx) => {
		if (!ctx.isRecord() || !isPlainObject(ctx.context)) {
			return
		}

		const { context } = ctx

		for (const k in context) {
			const value = context[k]
			const res = pattern.safeParse(value)
			if (!res.success) {
				continue
			}
			context[k] = fn({ parent: context, context: value, key: k })
		}
	})

	//@ts-expect-error experimental
	return value
}
