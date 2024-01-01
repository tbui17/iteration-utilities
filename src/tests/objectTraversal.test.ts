import { describe, expect, it } from "vitest"
import { isSuccessfulTreeUpdateStatus, postDFSObjectTraversal } from ".."
import _ from "lodash"

type ArrayNode = [
	depth: number,
	value: number,
	left: null | object,
	right: null | object,
]

enum ArrayNodeProps {
	depth,
	value,
	left,
	right,
}

describe("basic postDFS record", () => {
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

	it("should track depth correctly", () => {
		let traversed = false
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.depth === 0) {
				expect(ctx.depth).toBe(0)
				traversed = true
			}
		})
		let encounterCount = 0
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord()) {
				expect(ctx.context.depth).toBe(ctx.depth)
				encounterCount++
			}
		})
		expect(traversed).toBe(true)
		expect(encounterCount).toBe(7)
	})

	describe("should maintain path from root node", () => {
		const data = new Map<number, `p${number}`[]>()
			.set(1, ["p3", "p1"])
			.set(2, ["p3", "p2"])
			.set(3, ["p3"])
			.set(4, ["p6", "p4"])
			.set(5, ["p6", "p5"])
			.set(6, ["p6"])

		data.forEach((path, value) => {
			const message = {
				value,
				path,
			}
			const msg = JSON.stringify(message)
			it(msg, (t) => {
				let traversed = false
				postDFSObjectTraversal(tree, (ctx) => {
					if (ctx.isRecord() && ctx.context.value === value) {
						t.expect(ctx.path).toStrictEqual(path)
						traversed = true
					}
				})
				t.expect(traversed).toBe(true)
			})
		})
	})

	it("should yield the expected context", () => {
		const expected = tree.p3

		let result: object | undefined

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 3) {
				result = ctx.context
				ctx.break()
			}
		})
		expect(result).toBe(expected)
	})

	it("should have no parent when yielding the root context", () => {
		let traversed = false

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 7) {
				expect(ctx.parent).toBeUndefined()
				traversed = true
				ctx.break()
			}
		})
		expect(traversed).toBe(true)
	})

	it("should have the correct parent", () => {
		let traversed = false

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 2) {
				expect(ctx.parent).toBe(tree.p3)
				traversed = true
				ctx.break()
			}
		})
		expect(traversed).toBe(true)
	})

	it("should retrieve ancestors", () => {
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 2) {
				expect(ctx.ancestors).toStrictEqual([tree, tree.p3])
				ctx.break()
			}
		})
	})
})

describe("basic postDFS array and record", () => {
	const p1: ArrayNode = [2, 1, null, null]
	const p2: ArrayNode = [2, 2, null, null]

	const tree = {
		value: 7,
		depth: 0,
		p3: {
			value: 3,
			depth: 1,
			p1,
			p2,
		},
		p6: {
			value: 6,
			depth: 1,
			p4: { depth: 2, value: 4, left: null, right: null },
			p5: { depth: 2, value: 5, left: null, right: null },
			UNIQUE_KEY: "UNIQUE_VALUE",
		},
	} as const

	it("should track depth correctly (basic)", () => {
		let traversed = false
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isArray() && ctx.context[ArrayNodeProps.value] === 1) {
				expect(ctx.depth).toBe(2)
				traversed = true
			}
		})
		expect(traversed).toBe(true)
	})

	it("should track depth correctly", () => {
		let encounterCount = 0
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord()) {
				expect(ctx.context.depth).toBe(ctx.depth)
				encounterCount++
			}
			if (ctx.isArray()) {
				expect(ctx.context[ArrayNodeProps.depth]).toBe(ctx.depth)
				encounterCount++
			}
		})
		expect(encounterCount).toBe(7)
	})

	it("should maintain path from root node", (t) => {
		let result: object | undefined
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.context === p2) {
				result = ctx.path
			}
		})
		t.expect(result).toStrictEqual(["p3", "p2"])
	})
})

describe("mutations", () => {
	it("should be able to freely modify the context", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		const expected = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: "leftVal1", right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 4) {
				ctx.context.left = "leftVal1"
			}
		})

		expect(tree).toStrictEqual(expected)
	})
})

describe("merge", () => {
	it("should merge provided object into the existing object", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		const expected = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: {
					depth: 2,
					value: 100, // 4 -> 100
					left: true, // null -> true
					right: null,
					extraProp: "extra", // new prop
				},
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 4) {
				ctx.merge({ value: 100, left: true, extraProp: "extra" })
			}
		})

		expect(tree).toStrictEqual(expected)
	})

	it("should maintain referential integrity after merging", () => {
		const expectedInequality = {
			depth: 2,
			value: 4,
			left: true,
			right: null,
		} as const
		const p4 = {
			...expectedInequality,
		}
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4,
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const
		const changes = { value: 100, left: true, extraProp: "extra" } as const
		const expectedValue = {
			...expectedInequality,
			...changes,
		}

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 4) {
				ctx.merge({ ...changes })
			}
		})

		expect(p4).toBe(tree.p6.p4)
		expect(tree.p6.p4).not.toStrictEqual(expectedInequality)
		expect(p4).not.toStrictEqual(expectedInequality)
		expect(p4).toStrictEqual(expectedValue)
	})

	it("should maintain referential integrity after merging when removeExisting = true, indicating deletion of existing keys but not dereferencing of the object.", () => {
		const base = {
			depth: 2,
			value: 4,
			left: "left",
			right: "right",
		}
		const p4 = {
			...base,
		}
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4,
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		const changes = { value: 100, left: true, extraProp: "extra" }

		let traversed = false

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 4) {
				const res = ctx.merge({ ...changes }, true)

				traversed = true

				expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
			}
		})

		expect(traversed).toBe(true)
		expect(p4).not.toStrictEqual(base)
		expect(p4).toBe(tree.p6.p4)
		expect(p4.right).toBeUndefined()
		expect(p4).toStrictEqual(changes)
	})

	it("should successfully merge under the root node context", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 7) {
				const res = ctx.merge({ prop1: "prop1Value" })
				expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
			}
		})

		expect(_.get(tree, "prop1")).toBe("prop1Value")
	})

	it("should successfully merge arrays into objects", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				"2": "oldval",
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		const expected = {
			value: 7,
			depth: 0,
			p3: {
				"0": "prop0", // <-- added
				"1": "prop1", // <-- added
				"2": "prop2", // <-- replace
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const
		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 3) {
				const res = ctx.merge(["prop0", "prop1", "prop2"])
				expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
			}
		})

		expect(tree).toStrictEqual(expected)
	})

	it("should successfully merge objects into arrays by pushing objects into it", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		const expected = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null, { prop1: "prop1Value" }], // <-- added
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isArray() && ctx.context[ArrayNodeProps.value] === 1) {
				const res = ctx.merge({ prop1: "prop1Value" })
				expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
			}
		})

		expect(tree).toStrictEqual(expected)
	})

	it("should merge arrays successfully", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		const expected = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null, "val1", "val2"], // <-- merged
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isArray() && ctx.context[ArrayNodeProps.value] === 1) {
				const res = ctx.merge(["val1", "val2"])
				expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
			}
		})

		expect(tree).toStrictEqual(expected)
	})
})

describe("replace", () => {
	it("should deny replacement on the root node", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const
		const clone = _.cloneDeep(tree)

		postDFSObjectTraversal(clone, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 7) {
				const res = ctx.replace({ prop1: "prop1Value" })
				expect(isSuccessfulTreeUpdateStatus(res)).toBe(false)
			}
		})

		expect(clone).toStrictEqual(tree)
	})

	it("should replace nodes, creating a new reference", () => {
		const base = { depth: 2, value: 4, left: null, right: null }
		const p4 = { ...base }

		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: [2, 1, null, null],
				p2: [2, 2, null, null],
			},
			p6: {
				value: 6,
				depth: 1,
				p4,
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.isRecord() && ctx.context.value === 4) {
				const res = ctx.replace({ prop1: "prop1Value" })
				expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
			}
		})

		expect(tree.p6.p4.depth).toBeUndefined()
		expect(tree.p6.p4.value).toBeUndefined()
		expect(tree.p6.p4.left).toBeUndefined()
		expect(tree.p6.p4.right).toBeUndefined()
		expect(tree.p6.p4).toHaveProperty("prop1", "prop1Value")
		expect(tree.p6.p4).not.toBe(p4)
	})

	it.each(["string", 13205947, true, false, null] as const)(
		"should accept primitive values for replacement. value: %s",
		(value) => {
			const tree = {
				value: 7,
				depth: 0,
				p3: {
					value: 3,
					depth: 1,
					p1: [2, 1, null, null],
					p2: [2, 2, null, null],
				},
				p6: {
					value: 6,
					depth: 1,
					p4: { depth: 2, value: 4, left: null, right: null },
					p5: { depth: 2, value: 5, left: null, right: null },
					UNIQUE_KEY: "UNIQUE_VALUE",
				},
			} as const

			const expected = {
				value: 7,
				depth: 0,
				p3: {
					value: 3,
					depth: 1,
					p1: [2, 1, null, null],
					p2: [2, 2, null, null],
				},
				p6: {
					value: 6,
					depth: 1,
					p4: value, // <-- replaced
					p5: { depth: 2, value: 5, left: null, right: null },
					UNIQUE_KEY: "UNIQUE_VALUE",
				},
			} as const

			postDFSObjectTraversal(tree, (ctx) => {
				if (ctx.isRecord() && ctx.context.value === 4) {
					const res = ctx.replace(value)
					expect(isSuccessfulTreeUpdateStatus(res)).toBe(true)
				}
			})

			expect(tree).toStrictEqual(expected)
		}
	)
})

describe("integration tests", () => {
	it("changes should target only the p1 and p2 nodes", () => {
		const tree = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: { depth: 2, value: 1, left: null, right: null },
				p2: [2, 2, null, null] as const satisfies ArrayNode,
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const
		const expected = {
			value: 7,
			depth: 0,
			p3: {
				value: 3,
				depth: 1,
				p1: {
					depth: 2,
					value: 1,
					left: "newLeft",
					right: null,
					extraProp: "extraProp",
				},
				p2: [
					2,
					2,
					null,
					null,
					{ extraProp: "extraProp", left: "newLeft" },
				] as const,
			},
			p6: {
				value: 6,
				depth: 1,
				p4: { depth: 2, value: 4, left: null, right: null },
				p5: { depth: 2, value: 5, left: null, right: null },
				UNIQUE_KEY: "UNIQUE_VALUE",
			},
		} as const

		postDFSObjectTraversal(tree, (ctx) => {
			if (ctx.ancestors.includes(tree.p3)) {
				ctx.merge({ extraProp: "extraProp", left: "newLeft" })
			}
		})
		expect(tree).toStrictEqual(expected)
	})

	describe("should be able to narrow the scope of change using context checks (p1 and p2)", () => {
		function createTree() {
			return {
				value: 7,
				depth: 0,
				p3: {
					value: 3,
					depth: 1,
					p1: { depth: 2, value: 1, left: null, right: null },
					p2: [2, 2, null, null] as const satisfies ArrayNode,
				},
				p6: {
					value: 6,
					depth: 1,
					p4: { depth: 2, value: 4, left: null, right: null },
					p5: { depth: 2, value: 5, left: null, right: null },
					UNIQUE_KEY: "UNIQUE_VALUE",
				},
			} as const
		}

		it("array", () => {
			const arrClone = createTree()
			const expectedArr = {
				value: 7,
				depth: 0,
				p3: {
					value: 3,
					depth: 1,
					p1: {
						depth: 2,
						value: 1,
						left: null,
						right: null,
					},
					p2: [
						2,
						2,
						null,
						null,
						{ extraProp: "extraProp", left: "newLeft" },
					] as const,
				},
				p6: {
					value: 6,
					depth: 1,
					p4: { depth: 2, value: 4, left: null, right: null },
					p5: { depth: 2, value: 5, left: null, right: null },
					UNIQUE_KEY: "UNIQUE_VALUE",
				},
			} as const
			postDFSObjectTraversal(arrClone, (ctx) => {
				if (ctx.isArray() && ctx.ancestors.includes(arrClone.p3)) {
					ctx.merge({
						extraProp: "extraProp",
						left: "newLeft",
					})
				}
			})

			expect(arrClone).toStrictEqual(expectedArr)
		})

		it("record", () => {
			const expectedRecord = {
				value: 7,
				depth: 0,
				p3: {
					value: 3,
					depth: 1,
					p1: {
						depth: 2,
						value: 1,
						left: "newLeft",
						right: null,
						extraProp: "extraProp",
					},
					p2: [2, 2, null, null] as const,
				},
				p6: {
					value: 6,
					depth: 1,
					p4: { depth: 2, value: 4, left: null, right: null },
					p5: { depth: 2, value: 5, left: null, right: null },
					UNIQUE_KEY: "UNIQUE_VALUE",
				},
			} as const
			const recordClone = createTree()
			postDFSObjectTraversal(recordClone, (ctx) => {
				if (ctx.isRecord() && ctx.ancestors.includes(recordClone.p3)) {
					ctx.merge({ extraProp: "extraProp", left: "newLeft" })
				}
			})
			expect(recordClone).toStrictEqual(expectedRecord)
		})
	})
})

it("should not recurse into native objects", () => {
	class Map2 extends Map {
		prop1 = { shouldNotBeTraversed: true }
	}

	class Set2 extends Set {
		prop1 = { shouldNotBeTraversed: true }
	}

	class Error2 extends Error {
		prop1 = { shouldNotBeTraversed: true }
	}

	const tree = {
		map: new Map2(),
		set: new Set2(),
		error: new Error2(),
	} as const

	let traversed = false

	postDFSObjectTraversal(tree, (ctx) => {
		expect(ctx.context).not.toHaveProperty("shouldNotBeTraversed")
		traversed = true
	})
	expect(traversed).toBe(true)
})
