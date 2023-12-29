import { describe, expect, expectTypeOf, it } from "vitest"
import { mapTupleToObject } from "../mapTupleToObject"
import { Simplify } from "type-fest"

describe("mapTupleToObject", () => {
	it("should map a tuple to an object using enums", () => {
		const tuple = [1, "two", true] as const
		const enums = {
			numberValue: 0,
			stringValue: 1,
			booleanValue: 2,
		}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({
			numberValue: 1,
			stringValue: "two",
			booleanValue: true,
		})

		expectTypeOf(result).toEqualTypeOf<{
			numberValue: true | 1 | "two"
			stringValue: true | 1 | "two"
			booleanValue: true | 1 | "two"
		}>()
	})

	it("should handle empty tuple", () => {
		const tuple: [] = []
		const enums = {}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({})

		expectTypeOf(result).toEqualTypeOf<{}>()
	})

	it("should handle empty enums", () => {
		const tuple = [1, "two", true] as const
		const enums = {}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({})

		expectTypeOf(result).toEqualTypeOf<{}>()
	})

	it("should handle missing tuple values", () => {
		const tuple = [1, "two", true] as const
		const enums = {
			numberValue: 0,
			stringValue: 1,
		}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({
			numberValue: 1,
			stringValue: "two",
		})

		expectTypeOf(result).toEqualTypeOf<{
			numberValue: true | 1 | "two"
			stringValue: true | 1 | "two"
		}>()
	})

	it("should handle extra tuple values", () => {
		const tuple = [1, "two", true, "extra"] as const
		const enums = {
			numberValue: 0,
			stringValue: 1,
			booleanValue: 2,
		}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({
			numberValue: 1,
			stringValue: "two",
			booleanValue: true,
		})

		expectTypeOf(result).toEqualTypeOf<{
			numberValue: true | 1 | "two" | "extra"
			stringValue: true | 1 | "two" | "extra"
			booleanValue: true | 1 | "two" | "extra"
		}>()
	})
})
