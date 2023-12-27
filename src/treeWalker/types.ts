export type ObjectOrArray<TValue = any> =
	| Record<string | number, TValue>
	| TValue[]
export type Visitor<T> = (context: T) => void
export interface TraversalContextWithDepth extends TraversalContext {
	depth: number
}
export interface TraversalContext {
	path: (string | number)[]
	current: ObjectOrArray
}
