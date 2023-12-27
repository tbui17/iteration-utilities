import { describe, expect, it } from "vitest"
import { postDFSObjectTraversal } from ".."

describe("basic postDFS", () => {
	const tree = {
		value: 7,
		depth: 0,
		p3: {
			value: 3,
			depth: 1,
			p1: { depth: 2, value: 1, left: null, right: null },
			p2: { depth: 2, value: 2, left: null, right: null },
		},
		p6: {
			value: 6,
			depth: 1,
			p4: { depth: 2, value: 4, left: null, right: null },
			p5: { depth: 2, value: 5, left: null, right: null },
			UNIQUE_KEY: "UNIQUE_VALUE",
		},
	} as const

	const depths = [0, 1, 2, 3, 4, 5, 6, 7]

	it("should track depth correctly", () => {
		let traversed = false
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.depth === 0) {
				expect(ctx.depth).toBe(0)
				traversed = true
			}
		})
		expect(traversed).toBe(true)
	})

	it("should traverse in postDFS order", () => {
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 7) {
				expect(ctx.depth).toBe(0)
				expect(ctx.path).toStrictEqual([])
			}
			if (ctx.isRecord() && ctx.context.value === 6) {
				expect(ctx.depth).toBe(1)
				expect(ctx.path).toStrictEqual(["p6"])
			}

			// const info = {
			// 	depth: ctx.depth,
			// 	path: ctx.path,
			// 	reversePath: ctx.reversePath,
			// }
			// console.log(info)
		})
	})
})
