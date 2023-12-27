import cloneDeep from "lodash/cloneDeep"
import isPlainObject from "lodash/isPlainObject"
import { type z } from "zod"
import { postDFSObjectTraversal } from "."

import {
	type OmitObjectFunctions,
	type SpreadDeepObject,
	type ReplaceDeepObject,
	type ReplaceDeepWithinObject,
} from "@tbui17/type-utils"

export function spreadByPattern<
	TValue extends object,
	TPattern extends z.ZodType<Record<string, any>>,
	TReturn extends Record<string, any>,
	TShouldClone extends boolean
>({
	fn,
	value,
	pattern,
	shouldClone,
}: {
	value: TValue
	pattern: TPattern
	fn: (ctx: Record<string, any> & z.infer<TPattern>) => TReturn
	shouldClone?: TShouldClone
}): SpreadDeepObject<TValue, z.infer<TPattern>, TReturn> {
	const obj = shouldClone ? cloneDeep(value) : value

	postDFSObjectTraversal(obj, (ctx) => {
		const { context } = ctx
		if (!ctx.isRecord() || !isPlainObject(context)) {
			return
		}

		if (!pattern.safeParse(context).success) {
			return
		}

		Object.assign(context, fn(context))
	})
	//@ts-expect-error experimental
	return obj
}

export function replaceByPattern<
	TValue extends object,
	TPattern extends z.ZodType<Record<string, any>>,
	TReturn extends Record<string, any>,
	TShouldClone extends boolean
>({
	fn,
	value,
	pattern,
	shouldClone,
}: {
	value: TValue
	pattern: TPattern
	fn: (ctx: Record<string, any> & z.infer<TPattern>) => TReturn
	shouldClone?: TShouldClone
}): ReplaceDeepObject<
	TShouldClone extends true ? OmitObjectFunctions<TValue> : TValue,
	z.infer<TPattern>,
	TReturn
> {
	const obj = shouldClone ? cloneDeep(value) : value

	postDFSObjectTraversal(obj, (ctx) => {
		if (!ctx.isRecord() || !isPlainObject(ctx.context)) {
			return
		}

		const { context } = ctx

		if (!pattern.safeParse(context).success) {
			return
		}

		const newContext = fn(context)

		for (const k in context) {
			if (!(k in newContext)) {
				delete context[k]
			}
			context[k] = newContext[k]
		}
	})

	//@ts-expect-error experimental
	return obj
}

export function replaceValuesWithinObject<
	TValue extends object,
	TPattern extends z.ZodTypeAny,
	TReturn,
	TShouldClone extends boolean
>({
	fn,
	value,
	pattern,
	shouldClone,
}: {
	value: TValue
	pattern: TPattern
	fn: (ctx: {
		parent: Record<string, any>
		context: z.infer<TPattern>
		key: string
	}) => TReturn
	shouldClone?: TShouldClone
}): ReplaceDeepWithinObject<
	TShouldClone extends true ? OmitObjectFunctions<TValue> : TValue,
	z.infer<TPattern>,
	TReturn
> {
	const obj = shouldClone ? cloneDeep(value) : value

	postDFSObjectTraversal(obj, (ctx) => {
		if (!ctx.isRecord() || !isPlainObject(ctx.context)) {
			return
		}

		const { context } = ctx

		for (const k in context) {
			const value = context[k]
			const res = pattern.safeParse(value)
			if (!res.success) {
				continue
			}
			context[k] = fn({ parent: context, context: value, key: k })
		}
	})

	//@ts-expect-error experimental
	return obj
}
