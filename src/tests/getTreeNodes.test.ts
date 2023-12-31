import { describe, expect, expectTypeOf, it } from "vitest"
import { getTreeNodes } from "../getTreeNodes"

describe("getTreeNodes", () => {
	const tree = {
		id: 1,
		tree: "tree",
		children: [
			{
				id: 2,
				child1: "child1",
				children: [
					{
						id: 3,
						grandChild: "grandchild1",
					},
					{
						id: 4,
						grandChild: "grandchild2",
					},
				],
			},
			{
				id: 5,
				child2: "child2",
			},
		],
	} as const
	it("should retrieve (record|array) nodes of tree by default", () => {
		const expected = [
			tree,
			tree.children[0],
			tree.children[0].children[0],
			tree.children[0].children[1],
			tree.children[1],
			tree.children,
			tree.children[0].children,
		] as const

		const res = getTreeNodes(tree)

		expect(res).toEqual(expect.arrayContaining(expected as any))
	})
	it("should retrieve all record nodes when excludeArrays is enabled", () => {
		const expected = [
			tree,
			tree.children[0],
			tree.children[0].children[0],
			tree.children[0].children[1],
			tree.children[1],
		] as const

		const res = getTreeNodes(tree, { excludeArrays: true })

		expect(res).toEqual(expect.arrayContaining(expected as any))
	})
})

describe("type test", () => {
	interface NodeWithChildren {
		nodeWithChildren: "nodeWithChildren"
		children: Node[]
	}
	interface Node {
		node: "node"
	}

	interface Child1 {
		child1: "child1"
	}
	interface Tree {
		tree: "tree"
		children: NodeWithChildren[]
		child1: Child1
	}

	const tree: Tree = {
		tree: "tree",
		children: [
			{
				nodeWithChildren: "nodeWithChildren",
				children: [
					{
						node: "node",
					},
				],
			},
		],
		child1: {
			child1: "child1",
		},
	}

	it("with arrays", () => {
		type Expected =
			| {
					tree: "tree"
					children: NodeWithChildren[]
					child1: {
						child1: "child1"
					}
			  }
			| NodeWithChildren[]
			| {
					nodeWithChildren: "nodeWithChildren"
					children: Node[]
			  }
			| Node[]
			| {
					node: "node"
			  }
			| {
					child1: "child1"
			  }
		const res = getTreeNodes(tree)

		expectTypeOf(res).toEqualTypeOf<Expected>()
	})

	it("without arrays", () => {
		type Expected =
			| {
					tree: "tree"
					children: NodeWithChildren[]
					child1: {
						child1: "child1"
					}
			  }
			| {
					nodeWithChildren: "nodeWithChildren"
					children: Node[]
			  }
			| {
					node: "node"
			  }
			| {
					child1: "child1"
			  }

		const res = getTreeNodes(tree, { excludeArrays: true })
		expectTypeOf(res).toEqualTypeOf<Expected>()
	})
})
