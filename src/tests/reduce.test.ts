import { expect, expectTypeOf, it } from "vitest"
import { reduceToMultiObject, reduceToObject } from "../reduce"

const data = [1, 2, 3]

it("reduceMultiObject should produce multimap-like object", () => {
	const expected = {
		a: [2],
		b: [4, 4],
	}
	const res = reduceToMultiObject(data, (s) => {
		if (s === 1) {
			return ["a", 2]
		} else if (s === -123) {
			return ["c", 41]
		}
		return ["b", 4]
	})

	expect(res).toEqual(expected)

	expectTypeOf(res).toEqualTypeOf<{
		a?: (2 | 4 | 41)[] | undefined
		c?: (2 | 4 | 41)[] | undefined
		b?: (2 | 4 | 41)[] | undefined
	}>()
})

it("reduceObject should produce K V Record", () => {
	const expected = {
		a: 2,
		b: 4,
	}
	const res = reduceToObject(data, (s) => {
		if (s === 1) {
			return ["a", 2]
		} else if (s === 2) {
			return ["b", 4]
		}
	})

	expect(res).toEqual(expected)
	expectTypeOf(res).toEqualTypeOf<{
		a?: 2 | 4 | undefined
		b?: 2 | 4 | undefined
	}>()
})

it("reduceToMultiObject should handle empty collection", () => {
	const expected = {}
	const res = reduceToMultiObject([], () => {
		return ["a", 2]
	})

	expect(res).toEqual(expected)
})

it("reduceToObject should handle empty collection", () => {
	const expected = {}
	const res = reduceToObject([], () => {
		return ["a", 2]
	})

	expect(res).toEqual(expected)
})
