import { describe, expect, it } from "vitest"
import { spreadByPattern } from "../patternMatch"
import * as z from "zod"

describe("spreadByPattern", () => {
	it("should spread the pattern correctly on the value", () => {
		const value = {
			name: "John",
			age: 30,
		}

		const pattern = z.object({
			name: z.string(),
			age: z.number(),
		})

		const result = spreadByPattern({
			value,
			pattern,
			fn: (ctx) => ({
				...ctx,
				isAdmin: false,
			}),
		})

		expect(result).toEqual({
			name: "John",
			age: 30,
			isAdmin: false,
		})
	})

	it("should not spread the pattern if it doesn't match", () => {
		const value = {
			name: "John",
			age: 30,
		}

		const pattern = z.object({
			name: z.string(),
			isAdmin: z.boolean(),
		})

		const result = spreadByPattern({
			value,
			pattern,
			fn: (ctx) => ({
				...ctx,
				isAdmin: false,
			}),
		})

		expect(result).toEqual({
			name: "John",
			age: 30,
		})
	})

	it("demo", () => {
		// Config object type
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

		// Using spreadByPattern to add a monitoringEnabled property
		const updatedConfig = spreadByPattern({
			value: deploymentConfigs,
			pattern: featuresSchema,
			fn: (ctx) => {
				// Adding a monitoringEnabled property based on the enableDebug setting
				// Context type is also partially inferred, based on provided schema.
				type InferredContextType = Record<string, any> & {
					enableDebug: boolean
					loggingLevel: string
				}
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
						name: string
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
						name: string
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

		expect(updatedConfig).toEqual(expectedOutput)
	})
})
