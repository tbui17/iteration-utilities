import { describe, expect, it } from "vitest"

import {
	twoPointerEach,
	twoPointerMap,
	twoPointerMapFilter,
} from "../twoPointer"

describe("twoPointerEach", () => {
	it("should execute the callback function for each pair of elements", () => {
		const items = [1, 2, 3, 4]
		const result: number[] = []

		twoPointerEach(items, (a, b) => {
			result.push(a + b)
		})

		expect(result).toEqual([3, 4, 5, 5, 6, 7])
	})
})

describe("twoPointerMap", () => {
	it("should apply the callback function to each pair of elements and return an array of results", () => {
		const items = [1, 2, 3, 4]
		const result = twoPointerMap(items, (a, b) => a + b)

		expect(result).toEqual([3, 4, 5, 5, 6, 7])
	})
})

describe("twoPointerMapFilter", () => {
	it("should apply the callback function to each pair of elements and return an array of filtered results", () => {
		const items = [1, 2, 3, 4]
		const result = twoPointerMapFilter(items, (a, b) => {
			if (a + b > 5) {
				return a + b
			}
		})

		expect(result).toEqual([6, 7])
	})
})
