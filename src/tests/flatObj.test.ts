import { expect, it } from "vitest"
import { flatObj } from ".."

it("should remove the selected property key from the merged object if the target is an object.", () => {
	const obj = { prop1: 1, data: { prop2: "value1" } }
	const flat = flatObj(obj, "data")

	expect(flat).not.toHaveProperty("data")
})

it("should flatten an object with a nested array", () => {
	const obj = { prop1: 1, data: [{ prop2: "value1" }, { prop2: "value2" }] }
	const flat = flatObj(obj, "data")
	expect(flat).toEqual([
		{ prop1: 1, prop2: "value1" },
		{ prop1: 1, prop2: "value2" },
	])
})

it("should flatten an array of objects with nested arrays", () => {
	const objs = [
		{ prop1: 1, data: ["a", "b"] },
		{ prop1: 2, data: ["c", "d"] },
	]
	const flatArray = flatObj(objs, "data")
	expect(flatArray).toEqual([
		{ prop1: 1, data: "a" },
		{ prop1: 1, data: "b" },
		{ prop1: 2, data: "c" },
		{ prop1: 2, data: "d" },
	])
})

it("should flatten an object with a nested object", () => {
	const obj = {
		prop1: "abc",
		data: ["value1", "value2"],
	}

	const flat = flatObj(obj, "data")

	expect(flat).toEqual([
		{ prop1: "abc", data: "value1" },
		{ prop1: "abc", data: "value2" },
	])
})

it("should not override existing properties of the objects within the nested array.", () => {
	const obj = {
		prop1: 1,
		data: [{ prop2: "value1", data: [{ prop3: "value2" }] }],
	}

	const flat = flatObj(obj, "data")

	expect(flat).toEqual([
		{ prop1: 1, prop2: "value1", data: [{ prop3: "value2" }] },
	])
})

it("should not override existing properties of the nested object.", () => {
	const obj = {
		prop1: 1,
		data: { prop1: "value1", prop2: "value2" },
	} as const

	const flat = flatObj(obj, "data")

	expect(flat).toEqual({
		prop1: "value1",
		prop2: "value2",
	})
})

const primitives = ["string", 1, true, null, undefined] as const

primitives.forEach((value) => {
	it(`should return the original object and do nothing if the target property is a primitive. Value: ${value}`, (ctx) => {
		const obj = { prop1: 1, data: value }
		const expected = { prop1: 1, data: value }
		const flat = flatObj(obj, "data")
		ctx.expect(flat).toEqual(expected)
	})
})
