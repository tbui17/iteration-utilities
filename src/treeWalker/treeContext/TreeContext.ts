import get from "lodash/get"
import { isObjectOrArray, numberSchema, PathError, type Visitor } from ".."
import { treeUpdateStatus } from "./treeUpdateStatus"
import { BaseTreeContext } from "./baseTreeContext"

/**
 * Represents the context of a node in a tree structure.
 * Provides methods to interact with the node and its position in the tree.
 */
export class TreeContext implements BaseTreeContext {
	private _key: string | number
	private _value: any
	private _context: Record<string | number, any>
	/**
	 * The depth of the current node in the tree, starting from 0 at the root context.
	 */
	public readonly depth: number
	private breakEmitter: () => void
	/**
	 * The path from the root node to the current node.
	 *
	 * This does not represent the path of the traversal, but rather the path to access the node from the root node.
	 *
	 *
	 * @example
	 * const tree = {
	 *   value: 1,
	 *   depth: 0,
	 *   left: {
	 *     value: 2,
	 *     depth: 1,
	 *     left: { depth: 2, value: 4, left: null, right: null },
	 *     right: { depth: 2, value: 5, left: null, right: null },
	 *   },
	 *   right: {
	 *     value: 3,
	 *     depth: 1,
	 *     left: { depth: 2, value: 6, left: null, right: null },
	 *     right: {
	 *       depth: 2,
	 *       value: 7, // <-- target
	 *       left: null,
	 *       right: null,
	 *       UNIQUE_KEY: "UNIQUE_VALUE",
	 *     },
	 *   },
	 * } as const;
	 *
	 * let path: Readonly<(string | number)[]> | undefined
	 * treeBFS(tree, (ctx) => {
	 *   if (ctx.isRecord() && ctx.key === "value" && ctx.value === 7) {
	 *     path = ctx.path;
	 *   }
	 * });
	 *
	 * expect(path).toStrictEqual(["right", "right", "value"]);
	 */
	public readonly path: Readonly<(string | number)[]>
	private _rootContext: Record<string | number, any>
	private changeEmitter: () => void

	constructor(
		key: string | number,
		value: any,
		context: Record<string | number, any>,
		depth: number,
		breakEmitter: () => void,
		path: (string | number)[],
		rootContext: Record<string | number, any>,
		changeEmitter: () => void
	) {
		this._key = key
		this._value = value
		this._context = context
		this.depth = depth
		this.breakEmitter = breakEmitter
		this.path = path
		this._rootContext = rootContext
		this.changeEmitter = changeEmitter
	}

	/**
	 * Returns an array of child objects or arrays in the tree context.
	 *
	 * @returns {Array<object | Array<any>>} The child objects or arrays.
	 */
	get children() {
		return Object.values(this._context).filter(isObjectOrArray)
	}

	/**
	 * Gets the value of the current context node.
	 *
	 * May cause unexpected behavior in traversal if mutated.
	 *
	 * @returns The value of the node.
	 */
	public get value() {
		return this._value
	}

	/**
	 * Sets the value of the current context node.
	 *
	 * If the original value or the new value is an object, neither will be traversed through after setting a value.
	 *
	 * @param value - The new value to be set.
	 */
	public set value(value) {
		this._context[this.key] = value
		this.changeEmitter()
	}

	/**
	 * Gets the key of the current context node.
	 * @returns The key of the node.
	 */
	public get key() {
		return this._key
	}

	/**
	 * Gets the root context of the tree.
	 * @returns The root context.
	 */
	public get rootContext(): Readonly<typeof this._rootContext> {
		return this._rootContext
	}

	/**
	 * Checks if the current context is at the root of the tree.
	 * @returns True if at the root, false otherwise.
	 */
	public isAtRoot() {
		return this.path.length === 1
	}

	/**
	 * Gets the parent context of the current node.
	 * @returns The parent context.
	 */
	public get parent(): Record<string, any> | any[] {
		return this.path.length === 1
			? this.rootContext
			: get(this.rootContext, this.path.slice(0, -1))
	}

	/**
	 * Returns an array of ancestors of the current context.
	 * An ancestor is a parent or a grandparent of the current context.
	 * Each ancestor is represented as a record or an array.
	 * @returns {Array<Record<string, any> | any[]>} The array of ancestors.
	 */
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

	/**
	 * Signals to break out of the tree traversal.
	 */
	public break() {
		this.breakEmitter()
	}

	/**
	 * Checks if the current context is an array.
	 * @returns True if the context is an array, false otherwise.
	 */
	public isArray(): this is ArrayContext {
		return Array.isArray(this._context)
	}

	/**
	 * Checks if the current context is a record (not an array).
	 * @returns True if the context is a record, false if it's an array.
	 */
	public isRecord(): this is RecordContext {
		return !this.isArray()
	}

	/**
	 * Gets the current context.
	 *
	 * Mutating the context's structure may cause unexpected behavior.
	 *
	 * @returns The current context, either as a record or an array.
	 */
	public get context(): Record<string, any> | any[] {
		return this._context
	}

	/**
	 * Gets the current context as a record or throws an error if it's an array.
	 * @returns The context as a record.
	 * @throws Error if the context is an array.
	 */
	public getOrThrowRecordContext() {
		if (Array.isArray(this._context)) {
			throw new Error("Expected record context")
		}
		return this._context
	}

	/**
	 * Gets the current context as an array or throws an error if it's not an array.
	 * @returns The context as an array.
	 * @throws Error if the context is not an array.
	 */
	public getOrThrowArrayContext() {
		if (!Array.isArray(this._context)) {
			throw new Error("Expected array context")
		}
		return this._context
	}
}

/**
 * Specialized context interface for nodes that are records.
 */
interface RecordContext extends TreeContext {
	get key(): string
	get context(): Record<string, any>
	setKey(key: string): typeof treeUpdateStatus.SET_KEY_SUCCESSFUL
}

/**
 * Specialized context interface for nodes that are arrays.
 */
interface ArrayContext extends TreeContext {
	get key(): number
	get context(): any[]
	/**
	 * Cannot set key for array.
	 * @param CANNOT_SET_KEY_FOR_ARRAY never
	 */
	setKey(
		CANNOT_SET_KEY_FOR_ARRAY: never
	): typeof treeUpdateStatus.CANNOT_SET_KEY_FOR_ARRAY
}

/**
 * Type for a visitor function that operates on a TreeContext.
 */
export type TreeVisitor = Visitor<TreeContext>
