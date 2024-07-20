/**
 * Checks if a given function name starts with a specified string.
 */
export const checkStartString = (functionName: string, startString: string) =>
  functionName.startsWith(startString);

/**
 * Determines whether a given value is a Promise.
 */
export const isPromise = <T>(value: T) => value instanceof Promise;

/**
 * Checks if a given value is an array.
 */
export const isArray = <T>(value: T) => Array.isArray(value);
/**
 * Represents a placeholder or signal for "not found" scenarios.
 */
export class NotFound {}

/**
 * Checks if a given item is a non-null object (excluding arrays).
 */
export const isObject = <T>(item: T) =>
  (item && typeof item === "object" && !Array.isArray(item)) || false;

/**
 * Performs a shallow merge of multiple objects into a single object.
 * @param objects - Objects to merge.
 * @returns A new object with properties from all input objects shallow merged.
 */
export const shallowMerge = <T extends object = Record<string, any>>(
  ...objects: T[]
) => objects.reduce((prev, cur) => ({ ...prev, ...cur }), {} as T);

/**
 * Deep merges multiple objects into a single target object.
 * @param target - The target object to merge into.
 * @param sources - Objects to merge into the target.
 * @returns A new object with properties from all input objects deeply merged.
 */
export const deepMerge = <T extends object = Record<string, any>>(
  target: T,
  ...sources: object[]
): T => {
  const merge = (target: any, source: any): any => {
    Object.keys(source).forEach((key) => {
      const targetValue = target[key];
      const sourceValue = source[key];

      if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
        target[key] = targetValue.concat(sourceValue);
      } else if (isObject(targetValue) && isObject(sourceValue)) {
        target[key] = merge({ ...targetValue }, sourceValue);
      } else {
        target[key] = sourceValue;
      }
    });

    return target;
  };
  return sources.reduce((prev, cur) => merge(prev, cur), target) as T;
};

/**
 * Utility class for conditional logging based on environment.
 */
export class LOG {
  private static wrapConsoleForNonProd<T>(fun: T) {
    return process.env.NODE_ENV !== "production" ? fun : () => {};
  }
  static get debug() {
    return LOG.wrapConsoleForNonProd(console.log);
  }
  static get warn() {
    return LOG.wrapConsoleForNonProd(console.warn);
  }
  static get error() {
    return console.error;
  }
  static get info() {
    return LOG.wrapConsoleForNonProd(console.info);
  }
}
