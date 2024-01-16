import type { Paths, Get } from "type-fest"
import type { DiscriminantPaths, PopPath, LastPath } from "@tbui17/type-utils"

// 1. trim down string and use head as "accessor key", carry over tail in TPath
// 2. when TPath is finally trimmed down to single string and matches a key of the current context T, update key with TValue
type _NestedReplace<T, TPath, TValue> = TPath extends keyof T
	? {
			[K in keyof T]: K extends TPath ? TValue : T[K]
		}
	: TPath extends `${infer Head}.${infer Tail}`
		? Head extends keyof T
			? {
					[K in keyof T]: K extends Head
						? _NestedReplace<
								T[K],
								Tail extends Paths<T[K]> ? Tail : never,
								TValue
							>
						: T[K]
				}
			: never
		: never

type ExtractOnDiscriminator<
	T extends Record<string, unknown>,
	TKey extends keyof T,
	TValue,
> = Extract<T, { [K in TKey]: TValue }>

type NestedDiscriminate<
	T extends Record<string, unknown>,
	TPath extends string,
	TValue,
	_ParentContextPath extends string = PopPath<TPath>,
	_ParentContext = Get<T, _ParentContextPath>,
	_ParentContextDiscriminated = _ParentContext extends Record<string, unknown>
		? Extract<
				_ParentContext,
				ExtractOnDiscriminator<_ParentContext, LastPath<TPath>, TValue>
			>
		: never,
> = _NestedReplace<T, _ParentContextPath, _ParentContextDiscriminated>

/**
 * A type guard function that discriminates nested properties within a complex type structure.
 * It checks if the specified nested property (discriminator) of an object matches a given value.
 * This function is particularly useful for discriminating union types based on nested discriminators.
 *
 * Provides auto path inference to nested string union fields and autocomplete on the available values on the discriminant field.
 *
 * @template T - The type of the object to be checked.
 * @template T2 - The type representing the path to the discriminant property in the object.
 * @template T3 - The type of the value to match against the discriminant property.
 *
 * @param {T} obj - The object to be checked.
 * @param {T2} discriminator - A string representing the path to the nested discriminant property.
 *                             The path is dot-separated (e.g., 'prop1.type').
 * @param {T3} discriminatorValue - The value to compare against the value of the discriminant property.
 *                                  If the value at the nested path equals this value, the function
 *                                  returns true, otherwise false.
 *
 * @returns {boolean} - Returns `true` if the value at the specified path in the object
 *                      matches the `discriminatorValue`, otherwise `false`.
 *                      If the function returns `true`, the type of `obj` is narrowed down
 *                      in the context where this function is used.
 *
 * Note: This function assumes that the path provided in `discriminator` is valid for the object's type.
 *       If the path is invalid, TypeScript will not be able to infer the correct type.
 *
 * @example
 *
 *
 * type Prop1 = { type: "a"; prop1: "a" } | { type: "c"; prop1: "a" };
 *
 * interface TestData {
 *     type: "a";
 *     prop1:
 *         | {
 *             type: "a";
 *             prop2: number;
 *             prop1: Prop1;
 *           }
 *         | {
 *             type: "b";
 *             prop3: string;
 *             prop1: Prop1;
 *           };
 *     prop2: {
 *         prop4: boolean;
 *     };
 * }
 *
 * const examp: TestData = {
 *     type: "a",
 *     prop1: {
 *         type: "a",
 *         prop2: 0,
 *         prop1: {
 *             type: "a",
 *             prop1: "a",
 *         },
 *     },
 *     prop2: {
 *         prop4: false,
 *     },
 * };
 *
 * it("should narrow down nested discriminated unions", () => {
 *     type Expected = {
 *         type: "a";
 *         prop1: {
 *             type: "a";
 *             prop2: number;
 *             prop1: Prop1;
 *         };
 *         prop2: {
 *             prop4: boolean;
 *         };
 *     };
 *
 *     const res = (() => {
 *         if (nestedGuard(examp, "prop1.type", "a")) {
 *             return examp
 *         }
 *         return;
 *     })();
 *
 *     if (res === undefined) {
 *         return;
 *     }
 *
 *     expectTypeOf(res).toEqualTypeOf<Expected>();
 *     expect(res).toBeDefined()
 *     console.log(res.prop1.prop2); // Nested type information is retained
 * });
 *
 */
export function nestedGuard<
	T extends Record<string, any>,
	T2 extends string & DiscriminantPaths<T>,
	const T3 extends Get<T, T2>,
>(
	obj: T,
	discriminator: T2,
	discriminatorValue: T3
): obj is NestedDiscriminate<T, T2, T3> {
	const pathArr = discriminator.split(".")
	let current = obj

	for (const path of pathArr) {
		if (current === undefined) {
			return false
		}
		current = current[path]
	}

	return (current as unknown) === discriminatorValue
}
