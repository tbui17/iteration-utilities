export function mapFilter<TValue, TReturn>(
	items: TValue[],
	fn: (item: TValue) => TReturn | undefined
): TReturn[] {
	const result: TReturn[] = []
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const res = fn(item!)
		if (res !== undefined) {
			result.push(res)
		}
	}
	return result
}

export function mapFilterFirst<TValue, TReturn>(
	items: TValue[],
	fn: (item: TValue) => TReturn | undefined
): TReturn | undefined {
	for (let i = 0; i < items.length; i++) {
		const item = items[i]
		const res = fn(item!)
		if (res !== undefined) {
			return res
		}
	}
	return
}
