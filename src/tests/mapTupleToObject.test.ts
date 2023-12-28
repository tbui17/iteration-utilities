import { describe, expect, it } from "vitest"
import { mapTupleToObject } from "../mapTupleToObject"

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
	})

	it("should handle empty tuple", () => {
		const tuple: [] = []
		const enums = {}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({})
	})

	it("should handle empty enums", () => {
		const tuple = [1, "two", true] as const
		const enums = {}

		const result = mapTupleToObject(tuple, enums)

		expect(result).toEqual({})
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
	})
})
