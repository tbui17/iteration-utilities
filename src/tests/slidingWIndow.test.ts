import { describe, expect, it } from "vitest"

import {
	slidingWindowEach,
	slidingWindowMap,
	slidingWindowFilter,
	slidingWindowMapFilter,
} from "../slidingWindow"
import _ from "lodash"

describe("slidingWindowEach", () => {
	it("should iterate over sliding windows", () => {
		const items = [1, 2, 3, 4, 5]
		const result: number[][] = []

		slidingWindowEach(items, (window) => {
			result.push(window)
		})

		expect(result).toEqual([
			[1, 2],
			[2, 3],
			[3, 4],
			[4, 5],
		])
	})

	it("should handle empty array", () => {
		const items: number[] = []
		const result: number[][] = []

		slidingWindowEach(items, (window) => {
			result.push(window)
		})

		expect(result).toEqual([])
	})
})

describe("slidingWindowMap", () => {
	it("should map over sliding windows", () => {
		const items = [1, 2, 3, 4, 5]
		const result = slidingWindowMap(items, (window) => {
			return window.reduce((sum, num) => sum + num, 0)
		})

		expect(result).toEqual([3, 5, 7, 9])
	})

	it("should handle empty array", () => {
		const items: number[] = []
		const result = slidingWindowMap(items, (window) => {
			return window.reduce((sum, num) => sum + num, 0)
		})

		expect(result).toEqual([])
	})
})

describe("slidingWindowFilter", () => {
	it("should filter sliding windows", () => {
		const items = [1, 2, 3, 4, 5]
		const result = slidingWindowFilter(items, (window) => {
			return window.includes(3)
		})

		expect(result).toEqual(
			expect.arrayContaining([
				expect.arrayContaining([2, 3]),
				expect.arrayContaining([3, 4]),
			])
		)
	})

	it("should handle empty array", () => {
		const items: number[] = []
		const result = slidingWindowFilter(items, (window) => {
			return window.includes(3)
		})

		expect(result).toEqual([])
	})
})

describe("slidingWindowMapFilter", () => {
	it("should map and filter sliding windows", () => {
		const items = [1, 2, 3, 4, 5]
		const result = slidingWindowMapFilter(items, (window) => {
			const sum = window.reduce((sum, num) => sum + num, 0)
			if (sum > 5) return sum
		})

		expect(result).toEqual([7, 9])
	})

	it("should handle empty array", () => {
		const items: number[] = []
		const result = slidingWindowMapFilter(items, (window) => {
			const sum = window.reduce((sum, num) => sum + num, 0)
			if (sum > 5) return sum
		})

		expect(result).toEqual([])
	})
})
