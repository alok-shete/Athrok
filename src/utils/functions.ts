import { ANY } from "./types";

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

export function isArray<T>(value: T): boolean {
  return Array.isArray(value);
}

export class NotFound {}

export const isObject = <T>(item: T): boolean => {
  return (item && typeof item === "object" && !Array.isArray(item)) || false;
};

export const shallowMerge = <T extends object = Record<string, any>>(
  ...objects: T[]
): T => {
  return objects.reduce((prev, cur) => ({ ...prev, ...cur }), {} as T);
};

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

export class LOG {
  private static wrapConsoleForNonProd<T>(fun: T) {
    if (process.env.NODE_ENV !== "production") {
      return fun;
    }
    return (...rest: ANY[]) => {
      rest;
    };
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
