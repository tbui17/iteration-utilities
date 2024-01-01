const notMatchableItems = [Date, RegExp, Error, Buffer, Set, Map, Function]

export function notMatchable(value: any) {
	return notMatchableItems.some((item) => value instanceof item)
}
