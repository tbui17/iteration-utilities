import { describe, expect, it } from "vitest"
import { treeBFS } from ".."
import {
	PathResult,
	basicBfsTreeFixture,
} from "./testUtils/basicBfsTreeFixture"

describe("treeBFS basic", () => {
	const { testAncestors, testPaths, tree } = basicBfsTreeFixture()
	testAncestors()
	testPaths()
	it("should visit the correct order of nodes for a basic tree", () => {
		const result: number[] = []
		treeBFS(tree, (ctx) => {
			if (ctx.isRecord() && ctx.key === "value") {
				result.push(ctx.value)
			}
		})

		expect(result).toStrictEqual([1, 2, 3, 4, 5, 6, 7])
	})

	it("should visit the correct order of nodes for a basic tree with a break", () => {
		const result: number[] = []
		treeBFS(tree, (ctx) => {
			if (ctx.isRecord() && ctx.key === "value") {
				result.push(ctx.value)
				if (ctx.value === 2) {
					ctx.break()
				}
			}
		})

		expect(result).toStrictEqual([1, 2])
	})

	it("should have reference to the root context", () => {
		let result: Record<string, any> | undefined
		treeBFS(tree, (ctx) => {
			result = ctx.rootContext
			ctx.break()
		})
		expect(result).toBe(tree)
	})

	it("should start inside the root context on first layer", () => {
		let result: any
		let traversed = false
		treeBFS(tree, (ctx) => {
			result = ctx.parent
			traversed = true
			ctx.break()
		})
		expect(traversed).toBe(true)
		expect(result).toBe(tree)
	})

	it("should correctly indicate it is at the root context on first layer", () => {
		let isAtRoot = false
		let traversed = false
		treeBFS(tree, (ctx) => {
			isAtRoot = ctx.isAtRoot()
			traversed = true
			ctx.break()
		})
		expect(traversed).toBe(true)
		expect(isAtRoot).toBe(true)
	})

	it("should correctly record the depth", () => {
		treeBFS(tree, (ctx) => {
			if (ctx.key === "depth") {
				expect(ctx.depth).toBe(ctx.value)
			}
			if (ctx.key === "value" && ctx.value === 5) {
				expect(ctx.depth).toBe(2)
			}
		})
	})

	it("should retrieve children", () => {
		treeBFS(tree, (ctx) => {
			if (ctx.key === "value" && ctx.value === 1) {
				expect(ctx.children).toStrictEqual([tree.left, tree.right])
			}
		})
	})
})

describe("parent retrieval", () => {
	it("should retrieve parent successfully for a record parent context", () => {
		const parentCtx = {
			value: "parentValue",
			left: { value: 4, left: null, right: null },
			right: { value: 5, left: null, right: null },
		}
		const tree2 = {
			value: 1,
			parentCtx,
		}
		let result: any
		treeBFS(tree2, (ctx) => {
			if (ctx.key === "value" && ctx.value === "parentValue") {
				result = ctx.parent
				ctx.break()
			}
		})
		expect(result).toBe(parentCtx)
	})

	it("should retrieve parent successfully for an array parent context", () => {
		const parentCtx = [
			"parentValue",
			{ value: 4, left: null, right: null },
			{ value: 5, left: null, right: null },
		]
		const tree2 = {
			value: 1,
			parentCtx,
		}
		let result: any
		treeBFS(tree2, (ctx) => {
			if (ctx.isArray() && ctx.key === 0 && ctx.value === "parentValue") {
				result = ctx.parent
				ctx.break()
			}
		})
		expect(result).toBe(parentCtx)
	})
})

describe("tree mutations", () => {
	it("should be able to change one value in the tree without causing any other structural changes", () => {
		const tree = {
			value: 1,
			left: {
				value: 2,
				left: { value: 4, left: null, right: null },
				right: { value: 5, left: null, right: null },
			},
			right: {
				value: 3,
				left: { value: 6, left: null, right: null },
				right: { value: 7, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		}
		const expected = {
			value: 1,
			left: {
				value: 2,
				left: { value: 4, left: null, right: null },
				right: { value: 5, left: null, right: null },
			},
			right: {
				value: 3,
				left: { value: 6, left: null, right: null },
				right: { value: 7, left: null, right: null },
				UNIQUE_KEY: "newValue", // <-- changed
			},
		}

		treeBFS(tree, (ctx) => {
			if (ctx.key === "UNIQUE_KEY") {
				ctx.value = "newValue"
			}
		})
		expect(tree).toStrictEqual(expected)
	})

	it("should break when the break function is called", () => {
		const tree = {
			value: 1,
			left: {
				value: 2,
				left: { value: 4, left: null, right: null },
				right: { value: 5, left: null, right: null },
			},
			right: {
				value: 3,
				left: { value: 6, left: null, right: null },
				right: { value: 7, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		}

		const expected = {
			value: 1,
			left: {
				value: 2,
				left: { value: 4, left: "CHANGED", right: null }, // <-- changed left to CHANGED
				right: { value: 5, left: null, right: null },
			},
			right: {
				value: 3,
				left: { value: 6, left: null, right: null },
				right: { value: 7, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		}

		treeBFS(tree, (ctx) => {
			if (ctx.value === null) {
				ctx.value = "CHANGED"
				ctx.break()
			}
		})

		expect(tree).toStrictEqual(expected)
	})

	it("should not traverse into a node which was replaced", () => {
		const node = {
			value: 2,
			left: { value: 4, left: null, right: null },
			right: { value: 5, left: null, right: null },
		} as const

		const tree = {
			value: 1,
			left: node,
			right: {
				value: 3,
				left: { value: 6, left: null, right: null },
				right: { value: 7, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		}

		const expected = {
			value: 1,
			left: {
				// changed
				value: "CHANGED",
				left: { prop1: "abc" },
				right: "def",
			},
			right: {
				value: 3,
				left: { value: 6, left: null, right: null },
				right: { value: 7, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		}

		treeBFS(tree, (ctx) => {
			expect(ctx.context).not.toBe(node)
			expect(ctx.value).not.toBe(node.value)
			expect(ctx.value).not.toBe(node.left.value)
			expect(ctx.value).not.toBe(node.right.value)
			if (
				ctx.isRecord() &&
				ctx.key === "left" &&
				ctx.value === tree.left
			) {
				ctx.value = {
					value: "CHANGED",
					left: { prop1: "abc" },
					right: "def",
				}
			}
		})
		expect(tree).toStrictEqual(expected)
	})
})

describe("treeBFS complex JSON", () => {
	const tree = {
		level1: {
			record1: {
				level2: {
					record2: {
						level3: {
							record3: {
								level4: {
									string4: "string4value",
									array4: [
										1,
										2,
										3,
										{
											innerRecord: "innerString",
											innerArray: [7, 8, 9], // depth of inner array is 10
										},
									],
								},
							},
							array3: [
								"string1",
								"string2",
								{
									innerRecord: "innerString",
									innerArray: [10, 11, 12],
								},
								["innerArray1", "innerArray2", "innerArray3"],
							],
						},
					},
					array2: [
						4,
						5,
						6,
						{
							innerRecord: "innerString",
							innerArray: [13, 14, 15],
						},
					],
				},
			},
			array1: [
				"string4",
				"string5",
				{ innerRecord: "innerString", innerArray: [16, 17, 18] },
				["innerArray4", "innerArray5", "innerArray6"],
			],
		},
	} as const

	it("should maintain the correct order of nodes in its path for a complex JSON structure", () => {
		const targetCtx =
			tree.level1.record1.level2.record2.level3.array3[2].innerArray
		let result: PathResult
		treeBFS(tree, (ctx) => {
			if (
				ctx.isArray() &&
				(ctx.context as any) === targetCtx &&
				ctx.key === 1 &&
				ctx.value === 11
			) {
				result = ctx.path
			}
		})

		expect(result).toStrictEqual([
			"level1",
			"record1",
			"level2",
			"record2",
			"level3",
			"array3",
			2,
			"innerArray",
			1,
		])
	})

	it("should correctly track depth", () => {
		let traversed = false
		treeBFS(tree, (ctx) => {
			if (ctx.value === 8) {
				expect(ctx.depth).toBe(10)
				traversed = true
			}
		})
		expect(traversed).toBe(true)
	})
})
