import { describe, expect, it } from "vitest"
import { treeBFS } from "../.."



export type PathResult = Readonly<(string | number)[]> | undefined
export function basicBfsTreeFixture() {
	const tree = {
		value: 1,
		depth: 0,
		left: {
			value: 2,
			depth: 1,
			left: { depth: 2, value: 4, left: null, right: null },
			right: { depth: 2, value: 5, left: null, right: null },
		},
		right: {
			value: 3,
			depth: 1,
			left: { depth: 2, value: 6, left: null, right: null },
			right: { depth: 2, value: 7, left: null, right: null },
			UNIQUE_KEY: "UNIQUE_VALUE",
		},
	} as const

	const ancestorMap = new Map<number, object[]>()
		.set(1, [tree])
		.set(2, [tree, tree.left])
		.set(3, [tree, tree.right])
		.set(4, [tree, tree.left, tree.left.left])
		.set(5, [tree, tree.left, tree.left.right])
		.set(6, [tree, tree.right, tree.right.left])
		.set(7, [tree, tree.right, tree.right.right])

	const pathMap = new Map<number, PathResult>()
		.set(1, ["value"])
		.set(2, ["left", "value"])
		.set(3, ["right", "value"])
		.set(4, ["left", "left", "value"])
		.set(5, ["left", "right", "value"])
		.set(6, ["right", "left", "value"])
		.set(7, ["right", "right", "value"])

	function testAncestors() {
		return describe("ancestors", () => {
			ancestorMap.forEach((ancestorPath, nodeValue) => {
				it(`should retrieve ancestors for node ${nodeValue}`, () => {
					let traversed = false
					treeBFS(tree, (ctx) => {
						if (ctx.key === "value" && ctx.value === nodeValue) {
							expect(ctx.ancestors).toStrictEqual(ancestorPath)
							traversed = true
						}
					})
					expect(traversed).toBe(true)
				})
			})
		})
	}

	function testPaths() {
		return describe("paths", () => {
			pathMap.forEach((path, nodeValue) => {
				it(`should retrieve the correct path for node ${nodeValue}`, () => {
					let traversed = false
					treeBFS(tree, (ctx) => {
						if (
							ctx.isRecord() &&
							ctx.key === "value" &&
							ctx.value === nodeValue
						) {
							expect(ctx.path).toStrictEqual(path)
							traversed = true
						}
					})
					expect(traversed).toBe(true)
				})
			})
		})
	}

	return {
		tree,
		ancestorMap,
		pathMap,
		testAncestors,
		testPaths,
	}
}
