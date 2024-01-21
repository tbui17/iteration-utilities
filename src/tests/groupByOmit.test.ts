import { describe, expect, it } from "vitest"

import { groupByOmit } from "../groupByOmit"

describe("groupByOmit", () => {
	it("should group by single key and omit it in result", () => {
		const data = [
			{ id: 1, name: "Alice", age: 30 },
			{ id: 2, name: "Bob", age: 30 },
			{ id: 3, name: "Alice", age: 25 },
		]
		const result = groupByOmit(data, ["name"])
		expect(result).toEqual({
			Alice: [
				{ id: 1, age: 30 },
				{ id: 3, age: 25 },
			],
			Bob: [{ id: 2, age: 30 }],
		})
	})

	it("should group by multiple keys and omit them in results", () => {
		type TestData = {
			prop1: string
			prop2: string
			prop3: string
			prop4: string
		}
		const data: TestData[] = [
			{ prop1: "a", prop2: "b", prop3: "c", prop4: "d" },
			{ prop1: "a", prop2: "b", prop3: "c", prop4: "d" },
			{ prop1: "a", prop2: "c", prop3: "c", prop4: "d" },
			{ prop1: "a", prop2: "c", prop3: "d", prop4: "d" },
		]
		const result = groupByOmit(data, ["prop1", "prop2"])
		const expected = {
			ab: [
				{ prop3: "c", prop4: "d" },
				{ prop3: "c", prop4: "d" },
			],
			ac: [
				{ prop3: "c", prop4: "d" },
				{ prop3: "d", prop4: "d" },
			],
		}

		expect(result).toEqual(expected)
	})
})
