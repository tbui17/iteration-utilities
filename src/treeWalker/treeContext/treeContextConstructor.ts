export interface TreeContextConstructor<
	T extends object = Record<string, any> | any[],
	T2 extends object = Record<string, any> | any[],
	T3 extends (string | number)[] = (string | number)[]
> {
	context: T
	depth: number
	breakEmitter: () => void
	path: T3

	rootContext: T2
}

export interface ArrayTreeContextConstructor extends TreeContextConstructor {
	context: any[]
}

export interface RecordTreeContextConstructor extends TreeContextConstructor {
	context: Record<string, any>
}
