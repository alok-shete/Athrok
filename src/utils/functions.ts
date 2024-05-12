/**
 * Checks if a given function name starts with a specified string.
 * 
 * @param functionName - The name of the function to be checked.
 * @param startString - The string to check if the function name starts with.
 * @returns A boolean indicating whether the function name starts with the specified string.
 * 
 * @example
 * ```typescript
 * console.log(checkStartString("calculateArea", "calculate")); // true
 * console.log(checkStartString("calculateVolume", "compute")); // false
 * ```
 */
export function checkStartString(functionName: string, startString: string) {
  return functionName.startsWith(startString);
}

/**
 * Determines whether a given value is a Promise.
 *
 * @param value - The value to be checked.
 * @returns A boolean indicating whether the given value is a Promise.
 *
 * @template T - The type of the value being checked.
 *
 * @example
 * ```typescript
 * const promise = new Promise(resolve => resolve(42));
 * console.log(isPromise(promise)); // true
 * console.log(isPromise(42)); // false
 * ```
 */
export function isPromise<T>(value: T) {
  return value instanceof Promise;
}
