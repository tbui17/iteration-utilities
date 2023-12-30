import get from "lodash/get"
import {
	type ObjectOrArray,
	isObjectOrArray,
	type Visitor,
	BaseTreeContext,
	numberSchema,
	PathError,
} from ".."
import { Merger } from "./Merger"
import { treeUpdateStatus } from "./treeUpdateStatus"
import { type TreeContextConstructor } from "./treeContextConstructor"

/**
 * Shares many similar methods with TreeContext, refer to that class for documentation.
 */
export class ObjectTraversalContext implements BaseTreeContext {
	private _context: Record<string, any> | any[]
	public readonly depth: number
	private breakEmitter: () => void
	public readonly path: Readonly<(string | number)[]>

	private _rootContext: Record<string, any> | any[]
	public constructor({
		context,
		depth,
		breakEmitter,
		path,
		rootContext,
	}: Required<TreeContextConstructor>) {
		this._context = context
		this.depth = depth
		this.breakEmitter = breakEmitter
		this.path = path
		this._rootContext = rootContext
	}

	get children() {
		return Object.values(this._context).filter(isObjectOrArray)
	}

	get ancestors(): (Record<string, any> | any[])[] {
		return this.path.reduce(
			(acc, curr) => {
				acc.result.push(acc.context)
				const { context } = acc
				if (Array.isArray(context)) {
					const res = numberSchema.safeParse(curr)
					if (!res.success) {
						throw new PathError(curr, this.path, {
							cause: res.error,
						})
					}
					acc.context = context[res.data]
				} else {
					acc.context = context[curr]
				}
				return acc
			},
			{
				context: this._rootContext,
				result: [] as (typeof this.rootContext)[],
			}
		).result
	}

	public break() {
		this.breakEmitter()
	}

	public get context() {
		return this._context
	}

	public get rootContext(): Readonly<typeof this._rootContext> {
		return this._rootContext
	}

	/**
	 * Merges the provided context with the current context.
	 * 
	 * @param newContext - The new context to merge.
	 * @param removeExisting - Optional. Specifies whether to remove existing values in the current context. Default is false.
	 * @returns The status of the context merge operation.
	 */
	public merge(newContext: ObjectOrArray, removeExisting = false) {
		if (!isObjectOrArray(newContext)) {
			return treeUpdateStatus.NOT_CONTEXT_OR_ARRAY
		}
		Merger.merge(this.context, newContext, removeExisting)
		return treeUpdateStatus.CONTEXT_MERGED
	}

	public get parent(): Record<string, any> | any[] | undefined {
		if (this.isAtRoot()) {
			return
		}
		return this.path.length === 1
			? this.rootContext
			: get(this.rootContext, this.path.slice(0, -1))
	}

	/**
	 * Replaces the value at the current path with the specified value.
	 * If the current context is already at the root or an empty path, it returns `treeUpdateStatus.ALREADY_AT_ROOT_OR_EMPTY_PATH`.
	 * If the parent is an array and the last path element is not a valid index, it returns `treeUpdateStatus.INVALID_INDEX_TYPE_FOR_ARRAY`.
	 * Otherwise, it replaces the value at the current path and returns `treeUpdateStatus.CONTEXT_REPLACED`.
	 * @param value The value to replace with.
	 * @returns The status of the tree update operation.
	 */
	public replace(value: {} | null) {
		const parent = this.parent
		if (!parent) {
			return treeUpdateStatus.ALREADY_AT_ROOT_OR_EMPTY_PATH
		}

		const last = this.path[this.path.length - 1]!

		if (Array.isArray(parent)) {
			const res = numberSchema.safeParse(last)
			if (!res.success) {
				return treeUpdateStatus.INVALID_INDEX_TYPE_FOR_ARRAY
			}
			parent[res.data] = value
			return treeUpdateStatus.CONTEXT_REPLACED
		}

		parent[last] = value
		return treeUpdateStatus.CONTEXT_REPLACED
	}

	public isAtRoot() {
		return this.path.length === 0
	}

	public isArray(): this is ArrayMutatingContext {
		return Array.isArray(this.context)
	}

	public isRecord(): this is RecordMutatingContext {
		return !this.isArray()
	}

	public getOrThrowRecordContext() {
		if (Array.isArray(this.context)) {
			throw new Error("Expected record context")
		}
		return this.context
	}

	public getOrThrowArrayContext() {
		if (!Array.isArray(this.context)) {
			throw new Error("Expected array context")
		}
		return this.context
	}
}

interface RecordMutatingContext extends ObjectTraversalContext {
	context: Record<string, any>
}

interface ArrayMutatingContext extends ObjectTraversalContext {
	context: any[]
}

export type TreeMutatingVisitor = Visitor<ObjectTraversalContext>


