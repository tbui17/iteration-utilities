const successStatuses = {
	OK: "OK",
	CONTEXT_MERGED: "CONTEXT_MERGED",
	CONTEXT_REPLACED: "CONTEXT_REPLACED",
	CONTEXT_PUSHED: "CONTEXT_PUSHED",
	SET_KEY_SUCCESSFUL: "SET_KEY_SUCCESSFUL",
} as const

const failureStatuses = {
	FAILURE: "FAILURE",
	NOT_CONTEXT_OR_ARRAY: "NOT_CONTEXT_OR_ARRAY",
	ALREADY_AT_ROOT_OR_EMPTY_PATH: "ALREADY_AT_ROOT_OR_EMPTY_PATH",
	INVALID_STRING_INDEX_FOR_ARRAY: "INVALID_STRING_INDEX_FOR_ARRAY",
	INVALID_INDEX_TYPE_FOR_ARRAY: "INVALID_INDEX_TYPE_FOR_ARRAY",
	NOT_ARRAY: "NOT_ARRAY",
	CANNOT_SET_KEY_FOR_ARRAY: "CANNOT_SET_KEY_FOR_ARRAY",
} as const

export const treeUpdateStatus = {
	...successStatuses,
	...failureStatuses,
} as const

/**
 * Checks if the given tree update status is successful.
 * @param status - The tree update status to check.
 * @returns True if the status is successful, false otherwise.
 */
export function isSuccessfulTreeUpdateStatus(
	status: keyof typeof treeUpdateStatus
): status is keyof typeof successStatuses {
	return status in successStatuses
}
