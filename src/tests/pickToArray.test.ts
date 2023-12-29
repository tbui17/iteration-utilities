import { describe, expect, expectTypeOf, it } from "vitest"
import { pickToArray } from "../pickToArray"

describe("pickToArray", () => {
	it("should pick specific properties from an object and return them as an array", () => {
		const obj = {
			name: "John",
			age: 30,
			city: "New York",
			country: "USA",
		}

		const result = pickToArray(obj, ["name", "age", "country"])

		expect(result).toEqual(["John", 30, "USA"])

		expectTypeOf(result).toEqualTypeOf<(string | number)[]>()

		const result2 = pickToArray(obj, ["name", "country"])

		expect(result2).toEqual(["John", "USA"])

		expectTypeOf(result2).toEqualTypeOf<string[]>()
	})
})
