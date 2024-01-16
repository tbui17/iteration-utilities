import { describe, it, expect, expectTypeOf } from "vitest"
import { nestedGuard } from ".."

describe("nestedGuard", () => {
	type Prop1 = { type: "a"; prop1: "a" } | { type: "c"; prop1: "a" }

	interface TestData {
		type: "a"
		prop1:
			| {
					type: "a"
					prop2: number
					prop1: Prop1
			  }
			| {
					type: "b"
					prop3: string
					prop1: Prop1
			  }
		prop2: {
			prop4: boolean
		}
	}
	const examp: TestData = {
		type: "a",
		prop1: {
			type: "a",
			prop2: 0,
			prop1: {
				type: "a",
				prop1: "a",
			},
		},
		prop2: {
			prop4: false,
		},
	}
	const examp2: TestData = {
		type: "a",
		prop1: {
			type: "b",
			prop3: "asd",
			prop1: {
				type: "a",
				prop1: "a",
			},
		},
		prop2: {
			prop4: false,
		},
	}
	const examp3: TestData = {
		type: "a",
		prop1: {
			type: "a",
			prop2: 0,
			prop1: {
				type: "c",
				prop1: "a",
			},
		},
		prop2: {
			prop4: false,
		},
	}
	it("should discriminate on nested type", () => {
		const isA = nestedGuard(examp, "prop1.type", "a")
		expect(isA).toBe(true)
		const isB = nestedGuard(examp, "prop1.type", "b")
		expect(isB).toBe(false)
	})

	it("should discriminate on nested type case 2", () => {
		const isA = nestedGuard(examp2, "prop1.type", "a")
		expect(isA).toBe(false)
		const isB = nestedGuard(examp2, "prop1.type", "b")
		expect(isB).toBe(true)
	})
	it("should discriminate on deep nested type", () => {
		const isA = nestedGuard(examp3, "prop1.prop1.type", "a")
		expect(isA).toBe(false)
		const isC = nestedGuard(examp3, "prop1.prop1.type", "c")
		expect(isC).toBe(true)
	})

	it("should narrow down nested discriminated unions", () => {
		type Expected = {
			type: "a"
			prop1: {
				type: "a"
				prop2: number
				prop1: Prop1
			}
			prop2: {
				prop4: boolean
			}
		}
		const res = (() => {
			if (nestedGuard(examp, "prop1.type", "a")) {
				return examp
			}
		})()
		expect(res).toBeDefined()
		expectTypeOf(res!).toEqualTypeOf<Expected>()
	})

	it("should narrow down unions types within union types", () => {
		type Expected = {
			type: "a"
			prop1:
				| {
						type: "a"
						prop2: number
						prop1: {
							type: "c"
							prop1: "a"
						}
				  }
				| {
						type: "b"
						prop3: string
						prop1: {
							type: "c"
							prop1: "a"
						}
				  }
			prop2: {
				prop4: boolean
			}
		}
		const res = (() => {
			if (nestedGuard(examp3, "prop1.prop1.type", "c")) {
				return examp3
			}
		})()
		expect(res).toBeDefined()
		expectTypeOf(res!).toEqualTypeOf<Expected>()
	})
})
