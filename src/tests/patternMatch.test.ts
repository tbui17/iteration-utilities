import { describe, expect, expectTypeOf, it } from "vitest"
import { replaceByPattern, mergeByPattern } from "../patternMatch"
import * as z from "zod"
import _ from "lodash"
import { testNativeObject } from "./testUtils/testNativeObject"

describe("basic matching", () => {
	it("having all properties should succeed", () => {
		const value = {
			name: "John",
			age: 30,
		}

		const pattern = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = mergeByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		const expected = {
			name: "John",
			age: 30,
			extraProperty: "extraPropertyValue",
		}

		expect(result).toEqual(expected)

		expectTypeOf(result).toEqualTypeOf(expected)
	})

	it("missing properties should fail", () => {
		const value = {
			name: "John",
			age: 30,
		}

		const pattern = z.object({
			name: z.string(),
			extraProp1: z.string(),
		})

		const result = mergeByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		expect(result).toEqual({
			name: "John",
			age: 30,
		})
	})

	it("having extra properties (value extends pattern) should succeed", () => {
		const value = {
			name: "John",
			age: 30,
			prop1: "abc",
			prop2: "def",
			prop3: 12345,
		}

		const pattern = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = mergeByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		expect(result).toEqual({
			...value,
			extraProperty: "extraPropertyValue",
		})
	})
})

describe("object mutation", () => {
	it("should not mutate the original object by default", () => {
		const value = {
			name: "John",
			age: 30,
			prop1: "abc",
			prop2: "def",
			prop3: 12345,
		}
		const copy = _.cloneDeep(value)

		const pattern = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = mergeByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		expect(result).toEqual({
			...value,
			extraProperty: "extraPropertyValue",
		})

		expect(value).toStrictEqual(copy)
	})

	it("should mutate the original object if specified", () => {
		const value = {
			name: "John",
			age: 30,
			prop1: "abc",
			prop2: "def",
			prop3: 12345,
		}
		const expected = {
			...value,
			extraProperty: "extraPropertyValue",
		}
		const copy = _.cloneDeep(value)

		const pattern = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = mergeByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
			shouldClone: false,
		})

		expect(result).toEqual(expected)

		expect(value).not.toEqual(copy)
	})
})

describe("class matching", () => {
	class TestValue {
		constructor(
			public name: string,
			public age: number,
			public prop4: Date
		) {}

		method1(prop1: string) {
			console.log(prop1)
		}
	}

	class TestValue2 extends TestValue {
		getTime() {
			return 1
		}
	}

	class TestValue3 {
		constructor(
			public name: string,
			public age: number,
			public prop4: Date,
			public getTime: () => number
		) {}

		method1(prop1: string) {
			console.log(prop1)
		}
	}

	it("should match classes", () => {
		const value = new TestValue("John", 30, new Date())

		const pattern = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = mergeByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		type ExpectedType = {
			name: string
			age: number
			prop4: Date
			method1: (prop1: string) => void
			extraProperty: string
		}

		expectTypeOf(result).toEqualTypeOf<ExpectedType>()

		expect(result).toHaveProperty("extraProperty", "extraPropertyValue")
	})

	it("should match on non enumerable properties", () => {
		const value = new TestValue2("John", 30, new Date())

		const result2 = mergeByPattern({
			value,
			pattern: z.object({
				getTime: z.function(),
			}),
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		expect(result2).toHaveProperty("extraProperty")
	})

	it("should match on enumerable properties", () => {
		const value = new TestValue3("John", 30, new Date(), () => 1)

		const result2 = mergeByPattern({
			value,
			pattern: z.object({
				getTime: z.function(),
			}),
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})

		expect(result2).toHaveProperty("extraProperty")
	})
})

describe("special objects", () => {
	describe("test fixture stability check", () => {
		testNativeObject(() => ({ message: "message" }), ["message"], {
			expectFail: true,
		})

		testNativeObject(() => new Error("message"), ["message"], {
			expectFail: false,
		})
	})

	testNativeObject(() => new Date(), ["getTime"])
	testNativeObject(() => new RegExp(""), ["flags"])
	testNativeObject(() => new Error("message"), ["message"])
	testNativeObject(
		() => Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
		["encoding"]
	)
	testNativeObject(() => new Map(), ["size"])
	testNativeObject(() => new Set(), ["size"])
	testNativeObject(() => new Function("function1"), ["name"])
	testNativeObject(() => [], ["length"])
})

describe("replace", () => {
	it("should not replace matches at the root level", () => {
		type Value = {
			prop1: string
			prop2: string
			prop3: {
				prop1: string
				prop2: string
				prop10: number
			}
		}
		const value: Value = {
			prop1: "abc",
			prop2: "def",
			prop3: {
				prop1: "abc",
				prop2: "def",
				prop10: 312,
			},
		}

		const pattern = z.object({
			prop1: z.string(),
			prop2: z.string(),
		})

		const result = replaceByPattern({
			value,
			pattern,
			fn: () => ({
				extraProperty: "extraPropertyValue",
			}),
		})
		type Expected = {
			prop1: string
			prop2: string
			prop3: {
				extraProperty: string
			}
		}

		const expected: Expected = {
			prop1: "abc",
			prop2: "def",
			prop3: {
				extraProperty: "extraPropertyValue",
			},
		}

		expect(result).toEqual(expected)

		expectTypeOf(result).toEqualTypeOf<Expected>()
	})

	it("should replace objects with the returned value from the callback", () => {
		type DeploymentConfig = {
			development: {
				server: string
				port: number
				features: {
					enableDebug: boolean
					loggingLevel: string
					container: {
						name: string
						image: string
					}
				}
			}
			production: {
				server: string
				port: number
				features: {
					enableDebug: boolean
					loggingLevel: string
					container: {
						name: string
						image: string
					}
				}
			}
		}

		const deploymentConfigs: DeploymentConfig = {
			development: {
				server: "dev-server",
				port: 8080,
				features: {
					enableDebug: true,
					loggingLevel: "verbose",
					container: {
						name: "dev-container",
						image: "dev-image",
					},
				},
			},
			production: {
				server: "prod-server",
				port: 80,
				features: {
					enableDebug: false,
					loggingLevel: "error",
					container: {
						name: "prod-container",
						image: "prod-image",
					},
				},
			},
		}
		type ExpectedType = {
			development: {
				server: string
				port: number
				features: {
					replaced: number
					replaced2: string
				}
			}
			production: {
				server: string
				port: number
				features: {
					replaced: number
					replaced2: string
				}
			}
		}

		const expected: ExpectedType = {
			development: {
				server: "dev-server",
				port: 8080,
				features: {
					replaced: 100,
					replaced2: "verbose",
				},
			},
			production: {
				server: "prod-server",
				port: 80,
				features: {
					replaced: 100,
					replaced2: "error",
				},
			},
		}

		const featuresSchema = z.object({
			enableDebug: z.boolean(),
			loggingLevel: z.string(),
		})

		const res = replaceByPattern({
			value: deploymentConfigs,
			pattern: featuresSchema,
			fn(ctx) {
				type ExpectedCtx = (
					| {
							enableDebug: boolean
							loggingLevel: string
							container: {
								name: string
								image: string
							}
					  }
					| {
							enableDebug: boolean
							loggingLevel: string
							container: {
								name: string
								image: string
							}
					  }
				) &
					Record<string, any>
				expectTypeOf(ctx).toEqualTypeOf<ExpectedCtx>()
				return {
					replaced: 100,
					replaced2: ctx.loggingLevel,
				}
			},
			shouldClone: true,
		})
		expect(res).toEqual(expected)
		expectTypeOf(res).toEqualTypeOf<ExpectedType>()
	})
})

describe("demo", () => {
	it("should match complex nested structures and merge changes specified in the callback function", () => {
		// Config object type
		type DeploymentConfig = {
			development: {
				server: string
				port: number
				features: {
					enableDebug: boolean
					loggingLevel: string
					container: {
						name: "dev-container"
						image: string
					}
				}
			}
			production: {
				server: string
				port: number
				features: {
					enableDebug: boolean
					loggingLevel: string
					container: {
						name: "prod-container"
						image: string
					}
				}
			}
		}

		// Sample deployment configuration object
		const deploymentConfigs: DeploymentConfig = {
			development: {
				server: "dev-server",
				port: 8080,
				features: {
					enableDebug: true,
					loggingLevel: "verbose",
					container: {
						name: "dev-container",
						image: "dev-image",
					},
				},
			},
			production: {
				server: "prod-server",
				port: 80,
				features: {
					enableDebug: false,
					loggingLevel: "error",
					container: {
						name: "prod-container",
						image: "prod-image",
					},
				},
			},
		}

		// Define a Zod pattern to match objects with certain properties. Can be a partial match.
		const featuresSchema = z.object({
			enableDebug: z.boolean(),
			loggingLevel: z.string(),
		})

		// Using mergeByPattern to add a monitoringEnabled property
		const updatedConfig = mergeByPattern({
			value: deploymentConfigs,
			pattern: featuresSchema,
			fn: (ctx) => {
				// Adding a monitoringEnabled property based on the enableDebug setting
				// Context type is also inferred.
				type InferredContextType = (
					| {
							enableDebug: boolean
							loggingLevel: string
							container: {
								name: "dev-container"
								image: string
							}
					  }
					| {
							enableDebug: boolean
							loggingLevel: string
							container: {
								name: "prod-container"
								image: string
							}
					  }
				) &
					Record<string, any>

				expectTypeOf(ctx).toEqualTypeOf<InferredContextType>()
				return {
					monitoringEnabled: ctx.enableDebug,
				}
			},
		})
		// The return type of updatedConfig will be inferred based on the transformation applied:

		type InferredUpdatedConfigType = {
			development: {
				server: string
				port: number
				features: {
					enableDebug: boolean
					loggingLevel: string
					container: {
						name: "dev-container"
						image: string
					}
					monitoringEnabled: boolean
				}
			}
			production: {
				server: string
				port: number
				features: {
					enableDebug: boolean
					loggingLevel: string
					container: {
						name: "prod-container"
						image: string
					}
					monitoringEnabled: boolean
				}
			}
		}

		const expectedOutput = {
			development: {
				server: "dev-server",
				port: 8080,
				features: {
					enableDebug: true,
					loggingLevel: "verbose",
					monitoringEnabled: true, // Added based on the enableDebug value
					container: {
						name: "dev-container",
						image: "dev-image",
					},
				},
			},
			production: {
				server: "prod-server",
				port: 80,
				features: {
					enableDebug: false,
					loggingLevel: "error",
					monitoringEnabled: false, // Added based on the enableDebug value
					container: {
						name: "prod-container",
						image: "prod-image",
					},
				},
			},
		}

		expectTypeOf(updatedConfig).toEqualTypeOf<InferredUpdatedConfigType>()

		expect(updatedConfig).toStrictEqual(expectedOutput)
	})
})

