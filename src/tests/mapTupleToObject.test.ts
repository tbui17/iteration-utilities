import { describe, expect, expectTypeOf, it } from "vitest"
import { mapTupleToObject } from "../mappers"

describe("mapTupleToObject", () => {
	it("should map a tuple to an object using enums", () => {
		const tuple = [1, "two", true] as const
		enum Values {
			numberValue,
			stringValue,
			booleanValue,
		}

		const result = mapTupleToObject(tuple, Values)

		expect(result).toEqual({
			numberValue: 1,
			stringValue: "two",
			booleanValue: true,
		})

		expectTypeOf(result).toEqualTypeOf<{
			numberValue: 1
			stringValue: "two"
			booleanValue: true
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
		enum enums {
			numberValue,
			stringValue,
		}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({
			numberValue: 1,
			stringValue: "two",
		})

		expectTypeOf(result).toEqualTypeOf<{
			numberValue: 1
			stringValue: "two"
		}>()
	})
})
