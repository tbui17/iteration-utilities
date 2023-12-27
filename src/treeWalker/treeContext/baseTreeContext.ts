export interface BaseTreeContext {
	readonly depth: number
	readonly path: Readonly<(string | number)[]>
	get rootContext(): object
	get context(): object
	get parent(): {} | undefined
	break(): void
	isArray(): boolean
	isRecord(): boolean
	getOrThrowArrayContext(): {}
	getOrThrowRecordContext(): {}
}
