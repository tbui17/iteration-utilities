import { describe, expect, it } from "vitest"
import { mapFilter } from "../mapFilter"

describe("mapFilter", () => {
	it("should return an empty array when given an empty array", () => {
		const items: number[] = []
		const result = mapFilter(items, (item) => item * 2)
		expect(result).toStrictEqual([])
	})

	it("should return an array with filtered and mapped values", () => {
		const items = [1, 2, 3, 4, 5]
		const result = mapFilter(items, (item) => {
			if (item % 2 === 0) {
				return item * 2
			}
		})
		expect(result).toStrictEqual([4, 8])
	})

	it("should handle undefined values returned by the mapping function", () => {
		const items = [1, 2, 3, 4, 5]
		const result = mapFilter(items, (item) => {
			if (item % 2 === 0) {
				return undefined
			}
			return item * 2
		})
		expect(result).toStrictEqual([2, 6, 10])
	})

	it("should handle different types of input and output values", () => {
		const items = ["a", "b", "c", "d", "e"]
		const result = mapFilter(items, (item) => {
			if (item === "b") {
				return 2
			}
			if (item === "d") {
				return "four"
			}
		})
		expect(result).toStrictEqual([2, "four"])
	})
})
