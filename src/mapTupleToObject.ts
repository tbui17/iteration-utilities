export function mapTupleToObject<
	TTuple extends Readonly<any[]>,
	TEnums extends Record<string, any>,
>(tuple: TTuple, enums: TEnums) {
	const result = {} as TupleToObject<TTuple, TEnums>

	for (const key in enums) {
		const tupleIndex = enums[key]
		const tupleValue = tuple[tupleIndex]
		result[key] = tupleValue
	}

	return result
}
export type TupleToObject<
	TTuple extends readonly any[],
	TEnums extends Record<string, any>,
> = {
	-readonly [TEnumKey in keyof TEnums as number extends TEnumKey // remove any keys that are numbers to prevent [x:number]:unknown from appearing
		? never
		: TEnumKey]: TTuple[TEnums[TEnumKey]]
}
