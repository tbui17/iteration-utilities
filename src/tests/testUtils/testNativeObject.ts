import { z } from "zod"
import {expect, it} from "vitest"
import { spreadByPattern } from "../../patternMatch"



export function testNativeObject(
	constructor: () => any,
	keys: string[],
	{ expectFail = false } = {}
) {
	function createNotUndefined() {
		return z.any().refine((v) => v !== undefined)
	}
	const obj = constructor()
	const tester = expectFail ? it.fails : it

	tester(`Should not match the native object ${obj.constructor.name}`, () => {
		const base: Record<string, any> = {}
		for (const key of keys) {
			base[key] = createNotUndefined()
		}

		const pattern = z.object(base)

		class Value {
			prop = obj

			constructor() {
				Object.assign(this, base)
			}
		}

		const value = new Value()

		const result = spreadByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		expect(result).toHaveProperty("extraProperty")
		expect(result.prop).not.toHaveProperty("extraProperty")
	})
}
