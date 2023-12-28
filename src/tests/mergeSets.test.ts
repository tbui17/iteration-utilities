import { describe, expect, it } from "vitest"

import { mergeSets } from "../mergeSets"

describe("mergeSets", () => {
	it("should merge two sets correctly", () => {
		const set1 = new Set([1, 2, 3])
		const set2 = new Set([3, 4, 5])
		const mergedSet = mergeSets([set1, set2])
		expect(mergedSet).toEqual(new Set([1, 2, 3, 4, 5]))
	})

	it("should merge multiple sets correctly", () => {
		const set1 = new Set([1, 2, 3])
		const set2 = new Set([3, 4, 5])
		const set3 = new Set([5, 6, 7])
		const mergedSet = mergeSets([set1, set2, set3])
		expect(mergedSet).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]))
	})

	it("should merge sets from an iterable correctly", () => {
		const set1 = new Set([1, 2, 3])
		const set2 = new Set([3, 4, 5])
		const set3 = new Set([5, 6, 7])
		const sets = [set1, set2, set3]
		const mergedSet = mergeSets(sets.values())
		expect(mergedSet).toEqual(new Set([1, 2, 3, 4, 5, 6, 7]))
	})

	it("should handle empty sets correctly", () => {
		const set1 = new Set([1, 2, 3])
		const set2 = new Set<number>()
		const mergedSet = mergeSets([set1, set2])
		expect(mergedSet).toEqual(new Set([1, 2, 3]))
	})

	it("should handle an empty input correctly", () => {
		const mergedSet = mergeSets([])
		expect(mergedSet).toEqual(new Set())
	})
})
