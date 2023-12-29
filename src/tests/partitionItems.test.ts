import { describe, expect, expectTypeOf, it } from "vitest"
import { partitionItems } from "../partitionItems"
import { z } from "zod"

describe("partitionItems", () => {
	// Define some mock items and schemas for testing
	const items = [
		{ type: "fruit", name: "apple" },
		{ type: "vegetable", name: "carrot" },
		{ type: "fruit", name: "banana" },
		{ type: "unknown", name: "mystery" },
	]

	const patterns = {
		fruit: z.object({ type: z.literal("fruit") }).passthrough(),
		vegetable: z.object({ type: z.literal("vegetable") }).passthrough(),
	}

	it("should partition items correctly according to the schemas", () => {
		const { result, orphans } = partitionItems(items, patterns)

		expect(result.fruit).toEqual([
			{ name: "apple", type: "fruit" },
			{ name: "banana", type: "fruit" },
		])
		expect(result.vegetable).toEqual([
			{ type: "vegetable", name: "carrot" },
		])
		expect(orphans).toEqual([{ type: "unknown", name: "mystery" }])

		type Result = {
			fruit: z.objectOutputType<
				{
					type: z.ZodLiteral<"fruit">
				},
				z.ZodTypeAny,
				"passthrough"
			>[]
			vegetable: z.objectOutputType<
				{
					type: z.ZodLiteral<"vegetable">
				},
				z.ZodTypeAny,
				"passthrough"
			>[]
		}

		expectTypeOf(result).toEqualTypeOf<Result>()

		type Orphan = {
			type: string
			name: string
		}[]

		expectTypeOf(orphans).toEqualTypeOf<Orphan>()
	})

	it("should handle empty items array", () => {
		const { result, orphans } = partitionItems([], patterns)

		expect(result.fruit).toEqual([])
		expect(result.vegetable).toEqual([])
		expect(orphans).toEqual([])
	})

	it("should handle case with no matching schemas", () => {
		const nonMatchingItems = [{ type: "meat", name: "chicken" }]
		const { result, orphans } = partitionItems(nonMatchingItems, patterns)

		expect(result.fruit).toEqual([])
		expect(result.vegetable).toEqual([])
		expect(orphans).toEqual(nonMatchingItems)
	})

	it("should add items to all matching groups if prioritizeByKeyOrderOnConflict is false", () => {
		const ambiguousItems = [{ type: "fruit", name: "tomato" }]
		const ambiguousPatterns = {
			ambiguous: z.object({ type: z.string() }).passthrough(), // Matches all items
			...patterns,
		}
		const { result } = partitionItems(ambiguousItems, ambiguousPatterns, {
			prioritizeByKeyOrderOnConflict: false,
		})

		expect(result.fruit).toEqual(ambiguousItems)
		expect(result.vegetable).toEqual([])
		expect(result.ambiguous).toEqual(ambiguousItems)
	})

	it("should add items to the first matching group only if prioritizeByKeyOrderOnConflict is true", () => {
		const ambiguousItems = [{ type: "fruit", name: "tomato" }]
		const ambiguousPatterns = {
			ambiguous: z.object({ type: z.string() }).passthrough(), // Matches all items
			fruit: patterns.fruit,
			vegetable: patterns.vegetable,
		}
		const { result } = partitionItems(ambiguousItems, ambiguousPatterns, {
			prioritizeByKeyOrderOnConflict: true,
		})

		expect(result.ambiguous).toEqual(ambiguousItems)
		expect(result.fruit).toEqual([])
		expect(result.vegetable).toEqual([])
	})
})

describe("basic matching", () => {
	// Define the patterns
	const patterns = {
		numbers: z.number(),
		strings: z.string(),
		booleans: z.boolean(),
	}

	// Test case 1: Partition items based on patterns
	it("Partition items based on patterns", () => {
		const items = [1, "hello", true, 2, "world", false]
		const result = partitionItems(items, patterns)

		expect(result.result.numbers).toEqual([1, 2])
		expect(result.result.strings).toEqual(["hello", "world"])
		expect(result.result.booleans).toEqual([true, false])
		expect(result.orphans).toEqual([])
	})

	// Test case 2: Prioritize patterns by key order on conflict
	it("Prioritize patterns by key order on conflict", () => {
		const items = [1, "hello", true, 2, "world", false]
		const result = partitionItems(items, patterns, {
			prioritizeByKeyOrderOnConflict: true,
		})

		expect(result.result.numbers).toEqual([1, 2])
		expect(result.result.strings).toEqual(["hello", "world"])
		expect(result.result.booleans).toEqual([true, false])
		expect(result.orphans).toEqual([])
	})

	// Test case 3: Handle orphans
	it("Handle orphans", () => {
		const items = [1, "hello", null, true, 2, "world", false]
		const result = partitionItems(items, patterns)

		expect(result.result.numbers).toEqual([1, 2])
		expect(result.result.strings).toEqual(["hello", "world"])
		expect(result.result.booleans).toEqual([true, false])
		expect(result.orphans).toEqual([null])
	})

	// Test case 4: Empty items array
	it("Empty items array", () => {
		const items: any[] = []
		const result = partitionItems(items, patterns)

		expect(result.result.numbers).toEqual([])
		expect(result.result.strings).toEqual([])
		expect(result.result.booleans).toEqual([])
		expect(result.orphans).toEqual([])
	})

	// Test case 5: No patterns provided
	it("No patterns provided", () => {
		const items = [1, "hello", true, 2, "world", false]
		const result = partitionItems(items, {})

		expect(result.result).toEqual({})
		expect(result.orphans).toEqual(items)
	})
})
