import { describe, expect, it, expectTypeOf } from "vitest"
import { mapFilter } from "../mapFilter"

describe("mapFilter", () => {
	it("should work with heterogeneous unions and discriminated unions", () => {
		type DiscrimA = { type: "a"; value: number }
		const discrimA: DiscrimA = { type: "a", value: 1 }
		type DiscrimB = { type: "b"; value: string }
		const discrimB: DiscrimB = { type: "b", value: "2" }
		type DiscrimUnion = DiscrimA | DiscrimB
		const discrimUnion: DiscrimUnion[] = [discrimA, discrimB]

		type HeteroA = { prop1: string; prop2: number }
		const heteroA: HeteroA = { prop1: "prop1", prop2: 2 }
		type HeteroB = { prop3: boolean; prop4: "prop4" }
		const heteroB: HeteroB = { prop3: true, prop4: "prop4" }
		type HeteroUnion = HeteroA | HeteroB
		const heteroUnion: HeteroUnion[] = [heteroA, heteroB]

		const discrimUnionResult = mapFilter(discrimUnion, (item) => {
			if (item.type === "a") {
				return item
			}
		})

		expect(discrimUnionResult).toStrictEqual([discrimA])

		expectTypeOf(discrimUnionResult).toEqualTypeOf<DiscrimA[]>()

		const heteroUnionResult = mapFilter(heteroUnion, (item) => {
			if ("prop1" in item) {
				return item
			}
		})
		expect(heteroUnionResult).toStrictEqual([heteroA])

		expectTypeOf(heteroUnionResult).toEqualTypeOf<HeteroA[]>()
	})

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
