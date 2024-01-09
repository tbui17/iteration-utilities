import { type ObjectOrArray } from ".."
import { type ObjectTraversalContext } from "../treeContext/objectTraversalContext"

import { type TraversalContextWithDepth, type Visitor } from "../types"
import { MutatingContextProcessor } from "."
import { isObjectOrArray, getEntriesOfObjectOrArray } from "../internal/utils"

function loadDFSStack(data: ObjectOrArray) {
	const retrievalStack: TraversalContextWithDepth[] = [
		{ path: [], current: data, depth: 0 },
	]
	const processingStack: TraversalContextWithDepth[] = []

	while (retrievalStack.length) {
		const { current, depth, path } = retrievalStack.pop()!

		if (!isObjectOrArray(current)) {
			continue
		}
		// only load entire object since processing stack will iterate through entries
		processingStack.push({
			current,
			depth,
			path,
		})
		for (const [key, value] of getEntriesOfObjectOrArray(current)) {
			retrievalStack.push({
				current: value,
				depth: depth + 1,
				path: path.concat(key),
			})
		}
	}
	return processingStack
}

/**
 * Performs a post-order depth-first traversal of a tree-like data structure and applies a visitor function to each node.
 *
 * Creates a context specialized for performing mutating operations on the tree.
 *
 * Visits by entire objects rather than by entries.
 *
 * @template T - The type of the data structure.
 * @param {T} data - The data structure to traverse.
 * @param {Visitor<ObjectTraversalContext>} visitor - The visitor function to apply to each node.
 */
export function postDFSObjectTraversal<T>(
	data: T,
	visitor: Visitor<ObjectTraversalContext>
) {
	if (!isObjectOrArray(data)) {
		return
	}

	new MutatingContextProcessor(data, loadDFSStack(data), visitor).run()
}