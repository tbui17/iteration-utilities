import { type ObjectOrArray } from "../types"
import { notMatchable } from "../../internal/notMatchable"

export function isObjectOrArray(value: any): value is ObjectOrArray {
	return typeof value === "object" && value !== null && !notMatchable(value)
}

export function getEntriesOfObjectOrArray(value: ObjectOrArray) {
	return Array.isArray(value) ? value.entries() : Object.entries(value)
}

export function getValuesOfObjectOrArray(value: ObjectOrArray) {
	return Array.isArray(value) ? value : Object.values(value)
}
