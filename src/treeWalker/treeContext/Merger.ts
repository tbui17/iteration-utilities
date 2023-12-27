export class Merger {
	constructor(
		public target: any[] | Record<string, any>,
		public source: any[] | Record<string, any>,
		public removeExisting: boolean
	) {}

	public merge() {
		const target = this.target
		const source = this.source
		const isTargetArray = Array.isArray(target)
		const isSourceArray = Array.isArray(source)

		this.handleReplace(target)

		if (isTargetArray && isSourceArray) {
			this.mergeArray(target, source)
		}

		if (isTargetArray && !isSourceArray) {
			this.mergeObjectIntoArray(target, source)
		}

		if (!isTargetArray && isSourceArray) {
			this.mergeArrayIntoObject(target, source)
		}

		this.mergeObjects(target, source)
	}

	public static merge(
		target: any[] | Record<string, any>,
		source: any[] | Record<string, any>,
		removeExisting = false
	) {
		const merger = new Merger(target, source, removeExisting)
		merger.merge()
	}

	private handleReplace(target: any[] | Record<string, any>) {
		if (!this.removeExisting) {
			return
		}

		if (Array.isArray(target)) {
			target.length = 0
			return
		}

		for (const key in target) {
			delete target[key]
		}
	}

	private mergeArray(target: any[], source: any[]) {
		target.push(...source)
	}

	private mergeObjects(
		target: Record<string, any>,
		source: Record<string, any>
	) {
		Object.assign(target, source)
	}

	private mergeObjectIntoArray(target: any[], source: Record<string, any>) {
		target.push(...Object.entries(source))
	}

	private mergeArrayIntoObject(target: Record<string, any>, source: any[]) {
		Object.assign(target, source)
	}
}
