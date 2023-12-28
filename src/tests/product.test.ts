import { describe, expect, it } from "vitest"
import { product } from "../product"

describe("product", () => {
	it("should return an empty array when either input array is empty", () => {
		expect(product([], [1, 2, 3])).toStrictEqual([])
		expect(product([1, 2, 3], [])).toStrictEqual([])
		expect(product([], [])).toStrictEqual([])
	})

	it("should return the Cartesian product of two non-empty arrays", () => {
		expect(product([1, 2], ["a", "b"])).toStrictEqual([
			[1, "a"],
			[1, "b"],
			[2, "a"],
			[2, "b"],
		])

		expect(product(["x", "y", "z"], [true, false])).toStrictEqual([
			["x", true],
			["x", false],
			["y", true],
			["y", false],
			["z", true],
			["z", false],
		])
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
