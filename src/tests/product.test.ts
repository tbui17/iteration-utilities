import { describe, expect, expectTypeOf, it } from "vitest"
import { product } from "../product"

describe("product", () => {
	it("should return the Cartesian product of two non-empty arrays", () => {
		const result = product([1, 2], ["a", "b"])
		expect(product([1, 2], ["a", "b"])).toStrictEqual([
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"],
		])
		expectTypeOf(result).toEqualTypeOf<[number, string][]>()

		const result2 = product(["x", "y", "z"], [true, false])

		expect(result2).toStrictEqual([
			["x", true],
			["x", false],
			["y", true],
			["y", false],
			["z", true],
			["z", false],
		])

		expectTypeOf(result2).toEqualTypeOf<[string, boolean][]>()
	})

	it("should return an empty array when either input array is empty", () => {
		expect(product([], [1, 2, 3])).toStrictEqual([])
		expect(product([1, 2, 3], [])).toStrictEqual([])
		expect(product([], [])).toStrictEqual([])
	})

	it("should handle arrays with different lengths", () => {
		expect(product([1, 2, 3], ["a"])).toStrictEqual([
			[1, "a"],
			[2, "a"],
			[3, "a"],
		])

		expect(product(["x"], [true, false, null])).toStrictEqual([
			["x", true],
			["x", false],
			["x", null],
		])
	})
})
