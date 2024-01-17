import { describe, expect, it, expectTypeOf } from "vitest"
import { mapFilter, mapFind, mapGroups, mapPartition } from "../mappers"

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

type Items =
	| {
			type: "fruit"
			name: string
			abc: string
			ddd: string
	  }
	| {
			type: "vegetable"
			name: string
			def: string
	  }
	| {
			type: "abc"
			name: 12345
			def: string
	  }
	| {
			type: "fruit"
			name: string
			abc: string
	  }
	| {
			type: "unknown"
			name: string
			def: string
	  }
const items: Items[] = [
	{ type: "fruit", name: "apple", abc: "a", ddd: "a" },
	{ type: "vegetable", name: "carrot", def: "b" },
	{ type: "fruit", name: "banana", abc: "d" },
	{ type: "unknown", name: "mystery", def: "h" },
	{ type: "abc" as const, name: 12345, def: "h" } as const,
]

describe("mapFilterGroups", () => {
	it("should be able to infer type from structural filtering", () => {
		const res = mapGroups(items, {
			fruit1(item) {
				if ("ddd" in item) {
					return item
				}
			},
			abc(item) {
				if (item.type === "abc") {
					return item
				}
			},
			fruit2(item) {
				if (item.type === "fruit") {
					return item
				}
			},
			fruit3(item) {
				if (item.type === "fruit" && "ddd" in item) {
					return item
				}
			},
		})

		const expected = {
			fruit1: [{ type: "fruit", name: "apple", abc: "a", ddd: "a" }],
			abc: [{ type: "abc", name: 12345, def: "h" }],
			fruit2: [
				{ type: "fruit", name: "apple", abc: "a", ddd: "a" },
				{ type: "fruit", name: "banana", abc: "d" },
			],
			fruit3: [{ type: "fruit", name: "apple", abc: "a", ddd: "a" }],
		}

		expect(res).toEqual(expected)
		type Expected = {
			fruit1: {
				type: "fruit"
				name: string
				abc: string
				ddd: string
			}[]
			abc: {
				type: "abc"
				name: 12345
				def: string
			}[]
			fruit2: (
				| {
						type: "fruit"
						name: string
						abc: string
						ddd: string
				  }
				| {
						type: "fruit"
						name: string
						abc: string
				  }
			)[]
			fruit3: {
				type: "fruit"
				name: string
				abc: string
				ddd: string
			}[]
		}

		expectTypeOf(res).toEqualTypeOf<{
			fruit1: { type: "fruit"; name: string; abc: string; ddd: string }[]
			abc: { type: "abc"; name: 12345; def: string }[]
			fruit2: (
				| {
						type: "fruit"
						name: string
						abc: string
						ddd: string
				  }
				| {
						type: "fruit"
						name: string
						abc: string
				  }
			)[]
			fruit3: { type: "fruit"; name: string; abc: string; ddd: string }[]
		}>()
	})
})

describe("mapFind", () => {
	it("should be able to narrow down the type of an array of union types and among the ones that match the condition, only the first is obtained.", () => {
		type Items =
			| {
					type: "fruit"
					name: string
					abc: string
					ddd: string
			  }
			| {
					type: "vegetable"
					name: string
					def: string
			  }
			| {
					type: "fruit"
					name: string
					cvb: string
			  }

		const items: Items[] = [
			{ type: "fruit", name: "apple", abc: "a", ddd: "a" },
			{ type: "vegetable", name: "carrot", def: "b" },
			{ type: "fruit", name: "banana", cvb: "d" },
		]

		const res = mapFind(items, (item) => {
			if (item.type === "fruit") {
				return item
			}
		})
		type Expected =
			| {
					type: "fruit"
					name: string
					abc: string
					ddd: string
			  }
			| {
					type: "fruit"
					name: string
					cvb: string
			  }
			| undefined
		expectTypeOf(res).toEqualTypeOf<Expected>()

		expect(res).toEqual({
			type: "fruit",
			name: "apple",
			abc: "a",
			ddd: "a",
		})
	})

	it("should return undefined when given an empty array", () => {
		const items: number[] = []
		const result = mapFind(items, (item) => item * 2)
		expect(result).toBe(undefined)
	})

	it("should return the first mapped value that matches the predicate", () => {
		const items = [1, 2, 3, 4, 5]
		const result = mapFind(items, (item) => {
			if (item % 2 === 0) {
				return item * 2
			}
		})
		expect(result).toBe(4)
	})

	it("should handle undefined values returned by the mapping function", () => {
		const items = [1, 2, 3, 4, 5]
		const result = mapFind(items, (item) => {
			if (item % 2 === 0) {
				return undefined
			}
			return item * 2
		})
		expect(result).toBe(2)
	})

	it("should handle different types of input and output values", () => {
		const items = ["a", "b", "c", "d", "e"]
		const result = mapFind(items, (item) => {
			if (item === "b") {
				return 2
			}
			if (item === "d") {
				return "four"
			}
		})
		expect(result).toBe(2)
	})
})

describe("mapFilterPartition", () => {
	it("should order by key order on conflicts", () => {
		const { orphans, result } = mapPartition(items, {
			fruit(item) {
				if (item.type === "fruit" && item.name.length > 1) {
					return item
				}
			},
			fruit2(item) {
				if (item.type === "fruit" && item.name.length > 2) {
					return item
				}
			},
		})

		expect(result.fruit.length).toBe(2)
		expect(result.fruit2.length).toBe(0)
		expect(orphans.length).toBe(3)

		const total =
			result.fruit.length + result.fruit2.length + orphans.length
		expect(total).toBe(items.length)

		type Expected = {
			fruit: (
				| {
						type: "fruit"
						name: string
						abc: string
						ddd: string
				  }
				| {
						type: "fruit"
						name: string
						abc: string
				  }
			)[]
			fruit2: (
				| {
						type: "fruit"
						name: string
						abc: string
						ddd: string
				  }
				| {
						type: "fruit"
						name: string
						abc: string
				  }
			)[]
		}

		expectTypeOf(result).toEqualTypeOf<Expected>()
	})
})
