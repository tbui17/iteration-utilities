import { z } from "zod"
import { type ObjectOrArray } from "./types"

export function isObjectOrArray(value: any): value is ObjectOrArray {
	return typeof value === "object" && value !== null
}

export function getEntriesOfObjectOrArray(value: ObjectOrArray) {
	return Array.isArray(value) ? value.entries() : Object.entries(value)
}

export function getValuesOfObjectOrArray(value: ObjectOrArray) {
	return Array.isArray(value) ? value : Object.values(value)
}

export const numberSchema = z.coerce.number()