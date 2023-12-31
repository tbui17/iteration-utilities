import { numberSchema, PathError } from ".."

export function getAncestor(
	rootContext: any[] | Record<string, any>,
	path: Readonly<(string | number)[]> | (string | number)[]
) {
	let context = rootContext
	const result: (typeof context)[] = [context]
	for (const key of path.slice(0, -1)) {
		if (Array.isArray(context)) {
			const res = numberSchema.safeParse(key)
			if (!res.success) {
				throw new PathError(key, path, {
					cause: res.error,
				})
			}
			context = context[res.data]
		} else {
			context = context[key]
		}
		result.push(context)
	}
	return result
}
