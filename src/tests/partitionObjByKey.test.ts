import { describe, expect, it, expectTypeOf } from "vitest"

import { partitionObjByKey } from "../partitionObjByKey"

describe("partitionObjByKey", () => {
	it("should partition object by keys", () => {
		const obj = {
			name: "John",
			age: 30,
			city: "New York",
			country: "USA",
		}

		const keys = ["name", "age"] as const

		const [picked, remaining] = partitionObjByKey(obj, keys)

		expectTypeOf(picked).toEqualTypeOf<{ name: string; age: number }>()
		expectTypeOf(remaining).toEqualTypeOf<{
			city: string
			country: string
		}>()

		expect(picked).toEqual({
			name: "John",
			age: 30,
		})

		expect(remaining).toEqual({
			city: "New York",
			country: "USA",
		})
	})

	it("should not iterate over methods with classes", () => {
		class Person {
			constructor(
				public name: string,
				public age: number,
				public city: string,
				public country: string
			) {}

			greet() {
				return `Hello, my name is ${this.name}!`
			}
		}

		const person = new Person("John", 30, "New York", "USA")

		const keys = ["name", "age"] as const

		const [picked, remaining] = partitionObjByKey(person, keys)

		expectTypeOf(picked).toEqualTypeOf<{ name: string; age: number }>()
		expectTypeOf(remaining).toEqualTypeOf<{
			city: string
			country: string
		}>()

		expect(picked).toStrictEqual({
			name: "John",
			age: 30,
		})

		expect(remaining).toStrictEqual({
			city: "New York",
			country: "USA",
		})
	})

	it("should handle empty keys", () => {
		const obj = {
			name: "John",
			age: 30,
			city: "New York",
			country: "USA",
		}

		const keys: [] = []

		const [picked, remaining] = partitionObjByKey(obj, keys)

		expect(picked).toEqual({})
		expectTypeOf(picked).toEqualTypeOf<{}>()
		expect(remaining).toEqual(obj)
		expectTypeOf(remaining).toEqualTypeOf<typeof obj>()
	})

	it("type test", () => {
		const obj = {
			name: "John",
			age: 30,
			city: "New York",
			country: "USA",
		}

		const keys = ["name", "age"] as const
		const keys2 = ["name", "age"] as ["name", "age"]
		const keys3 = ["name", "age"] as ("name" | "age")[]
		const keys4 = ["name", "age"] as ["name", "age"] | ["name", "age"]
		const keys5 = ["name", "age"] as Readonly<["name", "age"]>
		const keys6 = ["name", "age"] as Readonly<("name" | "age")[]>
		const keys7 = ["name", "age", "country", "name"] as (keyof typeof obj)[]
		type PickedType = { name: string; age: number }
		type RemainingType = {
			city: string
			country: string
		}

		const [picked, remaining] = partitionObjByKey(obj, keys)
		expectTypeOf(picked).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining).toEqualTypeOf<RemainingType>()

		const [picked2, remaining2] = partitionObjByKey(obj, keys2)
		expectTypeOf(picked2).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining2).toEqualTypeOf<RemainingType>()

		const [picked3, remaining3] = partitionObjByKey(obj, keys3)
		expectTypeOf(picked3).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining3).toEqualTypeOf<RemainingType>()

		const [picked4, remaining4] = partitionObjByKey(obj, keys4)
		expectTypeOf(picked4).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining4).toEqualTypeOf<RemainingType>()

		const [picked5, remaining5] = partitionObjByKey(obj, keys5)
		expectTypeOf(picked5).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining5).toEqualTypeOf<RemainingType>()

		const [picked6, remaining6] = partitionObjByKey(obj, keys6)
		expectTypeOf(picked6).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining6).toEqualTypeOf<RemainingType>()

		const [picked7, remaining7] = partitionObjByKey(obj, keys7)

		expectTypeOf(picked7).toEqualTypeOf<typeof obj>()
		expectTypeOf(remaining7).toEqualTypeOf<{}>()
	})

	it("type test const obj", () => {
		const obj = {
			name: "John",
			age: 30,
			city: "New York",
			country: "USA",
		} as const

		const keys = ["name", "age"] as const
		const keys2 = ["name", "age"] as ["name", "age"]
		const keys3 = ["name", "age"] as ("name" | "age")[]
		const keys4 = ["name", "age"] as ["name", "age"] | ["name", "age"]
		const keys5 = ["name", "age"] as Readonly<["name", "age"]>
		const keys6 = ["name", "age"] as Readonly<("name" | "age")[]>
		const keys7 = ["name", "age", "country", "name"] as (keyof typeof obj)[]
		type PickedType = Readonly<{ name: "John"; age: 30 }>
		type RemainingType = Readonly<{
			city: "New York"
			country: "USA"
		}>

		const [picked, remaining] = partitionObjByKey(obj, keys)
		expectTypeOf(picked).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining).toEqualTypeOf<RemainingType>()

		const [picked2, remaining2] = partitionObjByKey(obj, keys2)
		expectTypeOf(picked2).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining2).toEqualTypeOf<RemainingType>()

		const [picked3, remaining3] = partitionObjByKey(obj, keys3)
		expectTypeOf(picked3).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining3).toEqualTypeOf<RemainingType>()

		const [picked4, remaining4] = partitionObjByKey(obj, keys4)
		expectTypeOf(picked4).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining4).toEqualTypeOf<RemainingType>()

		const [picked5, remaining5] = partitionObjByKey(obj, keys5)
		expectTypeOf(picked5).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining5).toEqualTypeOf<RemainingType>()

		const [picked6, remaining6] = partitionObjByKey(obj, keys6)
		expectTypeOf(picked6).toEqualTypeOf<PickedType>()
		expectTypeOf(remaining6).toEqualTypeOf<RemainingType>()

		const [picked7, remaining7] = partitionObjByKey(obj, keys7)

		expectTypeOf(picked7).toEqualTypeOf<typeof obj>()
		expectTypeOf(remaining7).toEqualTypeOf<{}>()
	})
})
