import { describe, expect, it } from "vitest"

import { allPairsEach, allPairsMap, allPairsMapFilter } from "../allPairs"

describe("allPairsEach", () => {
	it("should execute the callback function for each pair of elements", () => {
		const items = [1, 2, 3, 4]
		const result: number[] = []

		allPairsEach(items, (a, b) => {
			result.push(a + b)
		})

		expect(result).toEqual([3, 4, 5, 5, 6, 7])
	})
})

describe("allPairsMap", () => {
	it("should apply the callback function to each pair of elements and return an array of results", () => {
		const items = [1, 2, 3, 4]
		const result = allPairsMap(items, (a, b) => a + b)

		expect(result).toEqual([3, 4, 5, 5, 6, 7])
	})
})

describe("allPairsMapFilter", () => {
	it("should apply the callback function to each pair of elements and return an array of filtered results", () => {
		const items = [1, 2, 3, 4]
		const result = allPairsMapFilter(items, (a, b) => {
			if (a + b > 5) {
				return a + b
			}
		})

		expect(result).toEqual([6, 7])
	})
})
