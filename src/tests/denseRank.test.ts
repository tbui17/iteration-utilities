import { describe, expect, it } from "vitest"

import { denseRank } from "../denseRank"

describe("denseRank", () => {
	it("should assign ranks to items based on iteratees", () => {
		const items = [
			{ id: 1, score: 10 },
			{ id: 2, score: 20 },
			{ id: 3, score: 10 },
			{ id: 4, score: 30 },
			{ id: 5, score: 20 },
		]

		const result = denseRank(items, [(item) => item.score])

		const expected = [
			{ id: 1, score: 10, rank: 1 },
			{ id: 2, score: 20, rank: 2 },
			{ id: 3, score: 10, rank: 1 },
			{ id: 4, score: 30, rank: 3 },
			{ id: 5, score: 20, rank: 2 },
		]

		expect(result).toEqual(expect.arrayContaining(expected))
	})

	it("should handle empty array", () => {
		const items: any[] = []

		const result = denseRank(items, [(item) => item.score])

		expect(result).toEqual([])
	})

	it("should handle custom rank field name", () => {
		const items = [
			{ id: 1, score: 10 },
			{ id: 2, score: 20 },
			{ id: 3, score: 10 },
			{ id: 4, score: 30 },
			{ id: 5, score: 20 },
		]

		const result = denseRank(items, [(item) => item.score], {
			fieldName: "customRank",
		})

		const expected = [
			{ id: 1, score: 10, customRank: 1 },
			{ id: 2, score: 20, customRank: 2 },
			{ id: 3, score: 10, customRank: 1 },
			{ id: 4, score: 30, customRank: 3 },
			{ id: 5, score: 20, customRank: 2 },
		]

		expect(result).toEqual(expect.arrayContaining(expected))
	})

	it("should handle custom sort orders", () => {
		const items = [
			{ id: 1, score: 10 },
			{ id: 2, score: 20 },
			{ id: 3, score: 10 },
			{ id: 4, score: 30 },
			{ id: 5, score: 20 },
		]

		const result = denseRank(items, [(item) => item.score], {
			orders: ["desc"],
		})
		const expected = [
			{ id: 4, score: 30, rank: 1 },
			{ id: 1, score: 10, rank: 3 },
			{ id: 2, score: 20, rank: 2 },
			{ id: 3, score: 10, rank: 3 },
			{ id: 5, score: 20, rank: 2 },
		]

		expect(result).toEqual(expect.arrayContaining(expected))
	})

	it("should return an array sorted by rank", () => {
		const items = [
			{ id: 1, score: 10 },
			{ id: 2, score: 20 },
			{ id: 3, score: 10 },
			{ id: 4, score: 30 },
			{ id: 5, score: 20 },
		]

		const result = denseRank(items, [(item) => item.score])

		const expected = [
			{ id: expect.any(Number), score: 10, rank: 1 },
			{ id: expect.any(Number), score: 10, rank: 1 },
			{ id: expect.any(Number), score: 20, rank: 2 },
			{ id: expect.any(Number), score: 20, rank: 2 },
			{ id: 4, score: 30, rank: 3 },
		]

		expect(result).toEqual(expected)
	})
})
