import { type Constructor } from "type-fest"
import { type TraversalContextWithDepth } from ".."
import { ObjectTraversalContext } from "../treeContext/objectTraversalContext"
import { type ObjectOrArray, type Visitor } from "../types"

export abstract class ContextProcessor<T> {
	abstract Context: Constructor<T>
	protected shouldBreak = false

	constructor(
		protected data: ObjectOrArray,
		protected processingStack: TraversalContextWithDepth[],
		protected visitor: Visitor<T>
	) {}

	public abstract run(): this

	public breakEmitter = () => {
		this.shouldBreak = true
	}
}

export class MutatingContextProcessor extends ContextProcessor<ObjectTraversalContext> {
	Context = ObjectTraversalContext
	traversalPath: (string | number)[] = []

	public run() {
		while (this.processingStack.length) {
			const { current, depth, path } = this.processingStack.pop()!

			const last = path.at(-1)
			if (last !== undefined) {
				this.traversalPath.push(last)
			}

			this.visitor(
				new this.Context({
					context: current,
					depth,
					breakEmitter: this.breakEmitter,
					path,
					rootContext: this.data,
				})
			)
			if (this.shouldBreak) {
				return this
			}
		}
		return this
	}
}

