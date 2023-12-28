import { describe, expect, it } from "vitest"
import { pickToArray } from "../pickToArray"

describe("pickToArray", () => {
	it("should pick specific properties from an object and return them as an array", () => {
		const obj = {
			name: "John",
			age: 30,
			city: "New York",
			country: "USA",
		}

		const keys = ["name", "age", "country"] as const
		const result = pickToArray(obj, keys)

		expect(result).toEqual(["John", 30, "USA"])
	})

	it("should handle empty object and empty keys array", () => {
		const obj = {} as Record<string, any>
		const keys: readonly any[] = []
		const result = pickToArray(obj, keys)

		expect(result).toEqual([])
	})

	it("should handle duplicate keys in the keys array", () => {
		const obj = {
			name: "John",
			age: 30,
			country: "USA",
		}

		const keys = ["name", "age", "name", "country"] as const
		const result = pickToArray(obj, keys)

		expect(result).toEqual(["John", 30, "John", "USA"])
	})
})
