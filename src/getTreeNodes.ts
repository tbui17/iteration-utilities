import { ExtractObjectsDeep, Flatten } from "@tbui17/type-utils/src"
import { ObjectTraversalContext, postDFSObjectTraversal } from "."

/**
 * Traverses an object tree and collects nodes based on specified criteria.
 *
 * This function performs a post-order depth-first search (DFS) traversal
 * of an object tree. During the traversal, it collects nodes (objects)
 * into a set, optionally excluding array nodes based on a parameter.
 *
 * @template T - The type of the object to be traversed.
 * @template TExcludeArray - A boolean flag indicating whether array nodes should be excluded.
 * @param {T} obj - The root object of the tree to traverse.
 * @param {Object} [options] - Configuration options for the traversal.
 * @param {TExcludeArray} [options.excludeArrays=false] - When true, array nodes are excluded from the results.
 * @returns {(TExcludeArray extends true ? ExtractObjectsDeep<T> : Flatten<T>)}
 *           An array of nodes from the object tree. The type of the array elements
 *           depends on whether array nodes are excluded: if true, it returns an array of
 *           non-array objects deep within the structure;
 *           if false, it returns an array of all nodes.
 */
export function getTreeNodes<
	T extends object,
	TExcludeArray extends boolean = false,
>(
	obj: T,
	{
		excludeArrays = false as TExcludeArray,
	}: { excludeArrays?: TExcludeArray } = {}
): TExcludeArray extends true ? ExtractObjectsDeep<T>[] : Flatten<T>[] {
	const nodes = new Set()
	const shouldSkip = excludeArrays ? skipArrays : skipNothing
	postDFSObjectTraversal(obj, (ctx) => {
		if (shouldSkip(ctx)) {
			return
		}
		nodes.add(ctx.context)
	})

	return Array.from(nodes) as any
}
const skipArrays = (ctx: ObjectTraversalContext) => ctx.isArray()
const skipNothing = () => false
