## 📍 Overview

Lodash-like functions with an emphasis on type inference.

Refer to the [tests](src/tests/) folder and [typedocs](https://tbui17.github.io/iteration-utilities/) for up to date information.

## 📂 Repository Structure

```sh
└── iteration-utilities/
    ├── .changeset/
    │   ├── config.json
    ├── .github/
    │   └── workflows/
    │       ├── main.yml
    │       └── publish.yml
    ├── index.ts
    ├── package.json
    ├── pnpm-lock.yaml
    ├── prettier.config.mjs
    ├── src/
    │   ├── flatObj.ts
    │   ├── index.ts
    │   ├── mappers.ts
    │   ├── mergeSets.ts
    │   ├── patternMatch.ts
    │   ├── pickToArray.ts
    │   ├── product.ts
    │   ├── reduce.ts
    │   ├── treeWalker/
    │   │   ├── BFS.ts
    │   │   ├── errors.ts
    │   │   ├── index.ts
    │   │   ├── postDfs/
    │   │   ├── treeContext/
    │   │   ├── types.ts
    │   │   └── utils.ts
    │   └── twoPointer.ts
    └── tsconfig.json

```

---


## ⚙️ Modules

<details closed><summary>Root</summary>

| File                                                                                               | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| ---                                                                                                | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| [prettier.config.mjs](https://github.com/tbui17/iteration-utilities/blob/main/prettier.config.mjs) | The code defines a configuration file for Prettier, a code formatter that ensures a codebase has a consistent style. This configuration uses a four-space tab width, enables tab use, avoids single quotes, employs trailing commas according to ES5 rules, sets maximum print-width to 80 characters, only uses quotes where needed, and avoids semicolons. This config is then exported for use across the project.                                                                                                                                                                       |
| [index.ts](https://github.com/tbui17/iteration-utilities/blob/main/index.ts)                       | The code comprises an export statement referring to a directory structure of a TypeScript project called iteration-utilities. It includes source code files for various utilities, like object flattening, array manipulation, set merging, pattern matching, Cartesian product, reduction, tree traversal, and two-pointer system, along with configuration files for TypeScript, GitHub actions, and changesets. The index.ts serves as an entry point, exporting functionalities from the source code.                                                                                   |
| [tsconfig.json](https://github.com/tbui17/iteration-utilities/blob/main/tsconfig.json)             | The provided code represents a TypeScript project configuration (tsconfig.json), indicating the compiler's options for the project. It includes settings such as enabling ESNext as the target language, strict type-checking rules, and ES module interoperability. Furthermore, it includes settings for experimental decorators and JSON modules resolution. It specifies that the transpilation should include all TypeScript files in the src directory. The project structure suggests this is a utility library incorporating different algorithms and interactive Github workflows. |
| [package.json](https://github.com/tbui17/iteration-utilities/blob/main/package.json)               | The displayed code represents a TypeScript project directory structure and configurations in package.json for a module named @tbui17/iteration-utilities. The project includes scripts for building, releasing, and linting, along with dependencies for utilities and type checking. The src directory includes various utility functions and a treeWalker module which is likely for traversing data structures. The project uses the tsup tool for building and Changesets for release management.                                                                                       |
| [pnpm-lock.yaml](https://github.com/tbui17/iteration-utilities/blob/main/pnpm-lock.yaml)           | The given code is a directory structure depiction for a TypeScript project, including source files and configuration files. The project consists of various utility functions like mergeSets, reduce, pickToArray, among others. It also includes tree traversal algorithms like breadth-first search. The pnpm-lock.yaml file indicates that the project uses packages like lodash, zod, and others as dependencies; it also reveals that it uses changesets/cli as a development dependency.                                                                                              |

</details>

<details closed><summary>.changeset</summary>

| File                                                                                          | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| ---                                                                                           | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| [config.json](https://github.com/tbui17/iteration-utilities/blob/main/.changeset/config.json) | The provided code shows the directory structure of a TypeScript project iteration-utilities. It comes with a changeset configuration for tracking changes in the project. The repo includes various source files implementing utilities like flatObj, mergeSets, among others. It also contains workflow configurations for Github, a lock file for package management with pnpm, and a Prettier configuration file for code formatting. The treeWalker folder contains Breadth-First Search (BFS) functionality and other tree navigating utilities. |

</details>

<details closed><summary>Workflows</summary>

| File                                                                                                 | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---                                                                                                  | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| [main.yml](https://github.com/tbui17/iteration-utilities/blob/main/.github/workflows/main.yml)       | The code represents a project structure for a TypeScript library, including a continuous integration (CI) pipeline. Using GitHub Actions detailed in the main.yml file, the CI pipeline is triggered for every push made to any branch. This pipeline checks out the code, sets up the required Node.js environment and package manager (pnpm), installs the project dependencies using the lockfile to ensure consistency, then performs linting and builds the project.                                          |
| [publish.yml](https://github.com/tbui17/iteration-utilities/blob/main/.github/workflows/publish.yml) | The provided code is a GitHub Actions workflow configuration for automated publishing of a TypeScript project called iteration-utilities. It triggers when a CI workflow is completed or a push is made to main branch. After checking out the repository, it sets up the project using pnpm package manager and Node.js version 16. If CI tests pass, it either creates a release pull request or publishes the package directly by running pnpm run release, using the GitHub and NPM tokens for authentication. |

</details>

<details closed><summary>Src</summary>

| File                                                                                           | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ---                                                                                            | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| [flatObj.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/flatObj.ts)           | The code defines a helper function `flatObj` that flattens nested JavaScript objects or arrays of objects based on a provided key. It merges properties of the nested item (object or objects in an array) into its parent. If there are key conflicts, nested items' properties take precedence. If the key points to an array of primitive values, each value is added to a copy of the parent object. This function could be used to flatten complex data structures.                                                                                                                                            |
| [twoPointer.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/twoPointer.ts)     | The provided code contains a TypeScript module with three exported utility functions (twoPointerEach, twoPointerMap, twoPointerMapFilter). All three apply a two-pointer technique on an array, premiering a callback function to every pair of elements. twoPointerEach executes a callback for each pair, twoPointerMap applies a callback to each pair then returns the results, while twoPointerMapFilter applies a callback to each pair and returns the results only for non-undefined values.                                                                                                                |
| [pickToArray.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/pickToArray.ts)   | The provided code is a TypeScript function named pickToArray from the iteration-utilities package. It picks specified properties from an object and returns them as an array. The function utilizes generics to work with objects (T), keys (TKey), and an array of keys (TKeys), facilitating flexibility in handling multiple data types. The picked properties are then mapped into a new array and returned.                                                                                                                                                                                                    |
| [product.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/product.ts)           | This TypeScript module exports a function that takes in two arrays, applies a calculation to create the Cartesian product of these arrays, and returns an array of tuples. Each tuple contains an element from each input array.                                                                                                                                                                                                                                                                                                                                                                                    |
| [mergeSets.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/mergeSets.ts)       | The provided code is a function named mergeSets in a TypeScript project with a structured directory. It merges multiple sets into a single unique set. It takes an array or an iterable of sets as input and returns a new set containing all unique elements from the input sets. It employs a reducer for the merge operation. This function can be found in the mergeSets.ts file inside the src directory.                                                                                                                                                                                                      |
| [patternMatch.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/patternMatch.ts) | The code contains mergeByPattern and replaceByPattern functions that use post-order depth-first search to modify objects that match Zod-pattern specified. The mergeByPattern merges additional properties from a callback function to each matching object, while replaceByPattern replaces each nested matching object with a new one from a callback function. Both functions offer an option to perform the operation on a clone of the original object.                                                                                                                                                        |
| [reduce.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/reduce.ts)             | The code defines two TypeScript functions: reduceToMultiObject and reduceToObject. reduceToMultiObject reduces an array into an object that groups array elements into arrays based on a provided mapping function. reduceToObject converts an array into an object with properties defined by a mapping function. Both functions utilize generics and TypeScript's mapped types for flexibility encompassing various data types and structures.                                                                                                                                                                    |
| [index.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/index.ts)               | The provided code is part of a TypeScript project revolving around iteration utilities. Its main modules offer functionalities like creating flat objects (`flatObj`), mapping values (`mappers`), merging sets (`mergeSets`), pattern matching (`patternMatch`), picking elements to an array (`pickToArray`), product computation (`product`), array reduction (`reduce`), tree traversal (`treeWalker`), and implementing the two-pointer technique (`twoPointer`). These utilities are all exported from the `index.ts` file located in the `src/` directory.                                                   |
| [mappers.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/mappers.ts)           | The code contains several utility functions written in TypeScript for mapping and filtering arrays. `mapFilter` applies a function to each array element and returns a new array with the transformed values, excluding `undefined`. `mapFind` returns the first defined value from applying a function to each array element. `mapGroups` applies multiple functions to an array and returns an object where each key corresponds to the function results. `mapPartition` separates an array into subsets based on filtering functions. `mapTupleToObject` transforms a tuple into an object using provided enums. |

</details>

<details closed><summary>Treewalker</summary>

| File                                                                                          | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| ---                                                                                           | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| [utils.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/utils.ts)   | The code represents a part of a TypeScript project with scripts for handling array or object manipulations. It comprises a module utils.ts within the treeWalker directory. This file defines utility functions to determine if a variable is an object or array, get the entries or values of an array or object, and establish a number schema using zod library for data validation and parsing.                                                                                                                                  |
| [types.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/types.ts)   | The displayed directory tree and code snippet pertain to a TypeScript project centered around operations on data structures, including common operations like flatten, reduce, and pattern matching. The treeWalker subdirectory includes utilities for tree traversal. Within this, `types.ts` contains type declarations for the tree traversal context-including depth and current state-and a visitor interface for tree processing methods.                                                                                     |
| [BFS.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/BFS.ts)       | The provided code defines the BFS class for the breadth-first search of a tree-like data structure and exports a treeBFS function that performs this traversal. It takes a data object and a visitor function as arguments. During traversal, the visitor function is applied to every node. The traversal is stopped prematurely if the breakEmitter method is called, and the iteration of a node's children is skipped if the changeEmitter method is called.                                                                     |
| [errors.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/errors.ts) | The code defines a PathError class in the errors.ts file within the treeWalker directory in the iteration-utilities project. The class extends the base Error class and takes three parameters: current (can be string or number), path (an array that contains string or number), and opts (optional, includes any error cause). The class generates an error message detailing the unexpected path value.                                                                                                                          |
| [index.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/index.ts)   | The provided directory tree and code outlines a TypeScript project named iteration-utilities. The src directory contains various utility scripts for object manipulation, set merging, pattern matching, mapping, and array operations. The treeWalker subdirectory offers tools for tree traversal operations including Breadth-First Search (BFS), Post-Depth First Search (PostDfs), tree context processing, error handling, and utility functions. The treeWalker/index.ts file exports these functionalities for external use. |

</details>

<details closed><summary>Postdfs</summary>

| File                                                                                                                    | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ---                                                                                                                     | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| [processingStack.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/postDfs/processingStack.ts) | The provided code initializes a directory structure for a TypeScript project with multiple features such as tree walking algorithms, pattern matching, and set merging. The specific file `processingStack.ts` defines two classes, `ContextProcessor` and `MutatingContextProcessor`, which process data through different contexts during a tree traversal operation. The `MutatingContextProcessor` class alters its context over the run, with an option to prematurely stop the process via a break signal. |
| [index.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/postDfs/index.ts)                     | The code is part of a project structure under the iteration-utilities directory and specifically pertains to the postDfs subdirectory of treeWalker. Within the index.ts file of postDfs, all exports from PostDFS and processingStack modules are re-exported, allowing them to be accessed directly from postDfs. This enhances modularity and simplifies import statements elsewhere in the project.                                                                                                          |
| [PostDFS.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/postDfs/PostDFS.ts)                 | The provided code includes a function `postDFSObjectTraversal` that performs a post-order depth-first traversal of a tree-like data structure (either an object or an array), applying a visitor function to each node. Auxiliary function `loadDFSStack` prepares a processing stack for traversal. The main function manages traversal with depth and path context and conducts necessary checks before the traversal. It's purposed for running mutating operations on the data structure.                    |

</details>

<details closed><summary>Treecontext</summary>

| File                                                                                                                                      | Summary                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| ---                                                                                                                                       | ---                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| [TreeContext.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/TreeContext.ts)                       | The provided code defines the `TreeContext` class representing the context of a node in a tree structure. It includes methods for interacting with the node and its position within the tree. It allows obtaining the node key, value, root context, parent context and ancestors, checking if it's at the root, an array or a record, and modifying node's value. Also, it signals to break the tree traversal. Two specialized interfaces-`RecordContext` and `ArrayContext`-further define context specifics for record nodes and array nodes. |
| [treeUpdateStatus.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/treeUpdateStatus.ts)             | The provided code is part of a TypeScript library for tree walking operations. It defines string constants representing successful and unsuccessful statuses for tree updates and exports them as treeUpdateStatus. It also exports a function isSuccessfulTreeUpdateStatus that checks whether a given tree update status belongs to the successful statuses. The function is useful for triaging the outcome of a tree update operation.                                                                                                        |
| [objectTraversalContext.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/objectTraversalContext.ts) | The provided code implements an ObjectTraversalContext class in a TypeScript project. This class is meant for traversing and handling mutations on a tree-like data structure. It has methods for fetching object/array children and ancestors, breaking the traversal, merging new contexts, replacing values, and returning contexts or isAtRoot, isArray, isRecord status. The class also supports data validation during tree traversal and mutation, including handling path errors and providing update statuses.                           |
| [treeContextConstructor.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/treeContextConstructor.ts) | The code defines types in TypeScript for tree traversal in a codebase. It includes a general TreeContextConstructor interface used for defining a context for tree traversal. Available types include depth, path, breakEmitter function, rootContext, and context which can be an object or array. Two extensions of this interface are provided: ArrayTreeContextConstructor for array-based traversals and RecordTreeContextConstructor for object-based traversals. This promises more transparent and type-safe code.                        |
| [baseTreeContext.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/baseTreeContext.ts)               | The given code defines the interface `BaseTreeContext` in TypeScript, primarily used to navigate and manipulate tree-like data structures. It includes properties like depth, path, rootContext, context, parent, children, and ancestors, and methods like break, isArray, isRecord, etc. The interface enables specific operations on tree data structures, including context-specific actions like breaking traversal, checking if the context is an array or a record, and throwing an error if array or record context is absent.            |
| [index.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/index.ts)                                   | The code in src/treeWalker/treeContext/index.ts exports functionalities related to tree traversal from different modules in the same directory. These include the basic tree context functionality, the merger used for combining tree nodes, methods for object traversal, and mechanisms for constructing tree context and updating tree status.                                                                                                                                                                                                |
| [Merger.ts](https://github.com/tbui17/iteration-utilities/blob/main/src/treeWalker/treeContext/Merger.ts)                                 | The Merger class in this TypeScript code provides functionalities for merging arrays or objects (target and source). Depending on the type of the target and source, it handles four scenarios; merging two arrays, two objects, an object into an array, and an array into an object. It also has an optional removeExisting parameter that, when true, clears the target before merging. Each merge operation considers the type of data structures used. A static merge function is also added for simplified calling.                         |

</details>

---

## 🚀 Getting Started

### NPM Installation

```sh
npm install @tbui17/iteration-utilities
```

### 🔧 Installation

1. Clone the iteration-utilities repository:
```sh
git clone https://github.com/tbui17/iteration-utilities
```

2. Change to the project directory:
```sh
cd iteration-utilities
```

3. Install the dependencies:
```sh
npm install
```

### 🤖 Running iteration-utilities

```sh
npm run build && node dist/main.js
```

### 🧪 Tests
```sh
npm test
```

---

## 📄 License
MIT
