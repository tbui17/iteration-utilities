export function notMatchable(value: any) {
	return notMatchableItems.some((item) => value instanceof item)
}
export const notMatchableItems = [Date, RegExp, Error, Set, Map, Function]
