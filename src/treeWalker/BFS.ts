import { Queue } from "js-sdsl"
import { isObjectOrArray, getEntriesOfObjectOrArray } from "./internal/utils.js"
import { type TreeVisitor } from "./treeContext/TreeContext.js"
import { type TraversalContextWithDepth, type ObjectOrArray } from "./types.js"
import { TreeContext } from "./treeContext/TreeContext.js"

/**
 * Breadth First Search (BFS) class for traversing a tree-like data structure.
 */
class BFS {
	private queue: Queue<TraversalContextWithDepth> =
		new Queue<TraversalContextWithDepth>()
	private Context = TreeContext

	private shouldBreak = false

	private didChange = false

	constructor(private data: ObjectOrArray, private visitor: TreeVisitor) {
		if (!isObjectOrArray(data)) {
			return
		}
		this.queue.push({
			path: [],
			current: data,
			depth: 0,
		})
	}

	public run() {
		while (this.queue.length) {
			const { path, current, depth } = this.queue.pop()!

			const entries = getEntriesOfObjectOrArray(current)

			for (const [key, value] of entries) {
				const pathClone = path.concat(key)
				this.visitor(
					new this.Context(
						key,
						value,
						current,
						depth,
						this.breakEmitter,
						pathClone,
						this.data,
						this.changeEmitter
					)
				)

				if (this.shouldBreak) {
					return this
				}

				if (this.didChange) {
					this.didChange = false
					continue
				}

				if (isObjectOrArray(value)) {
					this.queue.push({
						path: pathClone,
						current: value,
						depth: pathClone.length,
					})
				}
			}
		}
		return this
	}

	private breakEmitter = () => {
		this.shouldBreak = true
	}

	private changeEmitter = () => {
		this.didChange = true
	}
}

/**
 *
 * Performs a breadth-first traversal of a tree-like data structure and applies a visitor function to each node.
 * Object mutations are not safe with this traversal method.
 *
 * @param data - The tree-like data structure to traverse.
 * @param visitor - The visitor object that defines the behavior during traversal.
 */

export function treeBFS<T>(data: T, visitor: TreeVisitor) {
	if (!isObjectOrArray(data)) {
		return
	}
	new BFS(data, visitor).run()
}
