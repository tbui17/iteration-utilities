export class PathError extends Error {
	constructor(
		current: string | number,
		path: (string | number)[] | Readonly<(string | number)[]>,
		opts: { cause?: Error } = {}
	) {
		const msg = {
			message: "Unexpected path value. Check source code.",
			path,
			current,
		}
		super(JSON.stringify(msg), opts)
	}
}