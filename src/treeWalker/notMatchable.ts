const notMatchableItems = new Set([
	Date,
	RegExp,
	Error,
	Buffer,
	Set,
	Map,
	Function,
])

export function notMatchable(value: any) {
	return (
		notMatchableItems.has(value.constructor) || typeof value === "function"
	)
}
