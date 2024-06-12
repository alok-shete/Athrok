import { vi, describe, it } from "vitest";
import {
  checkStartString,
  isPromise,
  isArray,
  isObject,
  shallowMerge,
  deepMerge,
  LOG,
} from "../../../src/utils/functions";

describe("functions", () => {
  describe("checkStartString", () => {
    it("should return true when the functionName starts with the startString", () => {
      expect(checkStartString("myFunction", "my")).toBe(true);
      expect(checkStartString("startFunction", "start")).toBe(true);
      expect(checkStartString("checkString", "check")).toBe(true);
    });

    it("should return false when the functionName does not start with the startString", () => {
      expect(checkStartString("myFunction", "your")).toBe(false);
      expect(checkStartString("startFunction", "end")).toBe(false);
      expect(checkStartString("checkString", "string")).toBe(false);
    });

    it("should return false when the startString is longer than the functionName", () => {
      expect(checkStartString("my", "myFunction")).toBe(false);
      expect(checkStartString("start", "startFunction")).toBe(false);
    });

    it("should handle empty strings correctly", () => {
      expect(checkStartString("", "")).toBe(true);
      expect(checkStartString("myFunction", "")).toBe(true);
      expect(checkStartString("", "myFunction")).toBe(false);
    });
  });

  describe("isPromise", () => {
    it("should return true for a Promise instance", () => {
      expect(isPromise(Promise.resolve())).toBe(true);
      expect(isPromise(new Promise((resolve) => resolve({})))).toBe(true);
    });

    it("should return false for non-Promise values", () => {
      expect(isPromise(null)).toBe(false);
      expect(isPromise(undefined)).toBe(false);
      expect(isPromise(42)).toBe(false);
      expect(isPromise("string")).toBe(false);
      expect(isPromise({})).toBe(false);
      expect(isPromise([])).toBe(false);
      expect(isPromise(() => {})).toBe(false);
    });

    it("should return false for objects that are not Promise instances but have a then method", () => {
      const thenable = { then: () => {} };
      expect(isPromise(thenable)).toBe(false);
    });
  });

  describe("isArray", () => {
    it("should return true for arrays", () => {
      expect(isArray([])).toBe(true);
      expect(isArray([1, 2, 3])).toBe(true);
      expect(isArray(new Array())).toBe(true);
    });

    it("should return false for non-array values", () => {
      expect(isArray(null)).toBe(false);
      expect(isArray(undefined)).toBe(false);
      expect(isArray(42)).toBe(false);
      expect(isArray("string")).toBe(false);
      expect(isArray({})).toBe(false);
      expect(isArray(() => {})).toBe(false);
      expect(isArray(new Set())).toBe(false);
      expect(isArray(new Map())).toBe(false);
    });

    it("should return false for array-like objects", () => {
      const arrayLike = { length: 0 };
      expect(isArray(arrayLike)).toBe(false);
    });
  });
  describe("isObject", () => {
    it("should return true for plain objects", () => {
      expect(isObject({})).toBe(true);
      expect(isObject({ a: 1 })).toBe(true);
      expect(isObject(Object.create(null))).toBe(true);
    });

    it("should return false for non-object values", () => {
      expect(isObject(null)).toBe(false);
      expect(isObject(undefined)).toBe(false);
      expect(isObject(42)).toBe(false);
      expect(isObject("string")).toBe(false);
      expect(isObject(true)).toBe(false);
      expect(isObject(() => {})).toBe(false);
      expect(isObject(Symbol("symbol"))).toBe(false);
    });

    it("should return false for arrays", () => {
      expect(isObject([])).toBe(false);
      expect(isObject([1, 2, 3])).toBe(false);
    });

    it("should return true for object instances", () => {
      class MyClass {}
      expect(isObject(new MyClass())).toBe(true);
      expect(isObject(new Date())).toBe(true);
    });

    it("should return false for functions that are objects", () => {
      function myFunction() {}
      myFunction.property = "value";
      expect(isObject(myFunction)).toBe(false);
    });
  });

  describe("shallowMerge", () => {
    it("should merge multiple objects shallowly", () => {
      const obj1 = { a: 1, b: 2 };
      const obj2 = { b: 3, c: 4 };
      const obj3 = { c: 5, d: 6 };
      const result = shallowMerge(obj1, obj2 as any, obj3 as any);

      expect(result).toEqual({ a: 1, b: 3, c: 5, d: 6 });
    });

    it("should return an empty object when no objects are provided", () => {
      const result = shallowMerge();
      expect(result).toEqual({});
    });

    it("should handle a single object correctly", () => {
      const obj1 = { a: 1, b: 2 };
      const result = shallowMerge(obj1);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("should handle objects with no overlapping keys correctly", () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const result = shallowMerge(obj1, obj2 as any);

      expect(result).toEqual({ a: 1, b: 2 });
    });

    it("should overwrite properties with the same key from left to right", () => {
      const obj1 = { a: 1 };
      const obj2 = { a: 2, b: 3 };
      const obj3 = { a: 3, c: 4 };
      const result = shallowMerge(obj1, obj2, obj3);

      expect(result).toEqual({ a: 3, b: 3, c: 4 });
    });

    it("should not modify the original objects", () => {
      const obj1 = { a: 1 };
      const obj2 = { b: 2 };
      const obj3 = { c: 3 };
      const result = shallowMerge(obj1, obj2 as any, obj3);

      expect(result).toEqual({ a: 1, b: 2, c: 3 });
      expect(obj1).toEqual({ a: 1 });
      expect(obj2).toEqual({ b: 2 });
      expect(obj3).toEqual({ c: 3 });
    });
  });

  describe("deepMerge", () => {
    it("should deep merge multiple objects", () => {
      const target = { a: 1, b: { c: 2 } };
      const source1 = { b: { d: 3 } };
      const source2 = { e: 4 };
      const result = deepMerge(target, source1, source2);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 }, e: 4 });
    });

    it("should concatenate arrays during merge", () => {
      const target = { a: [1, 2] };
      const source = { a: [3, 4] };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: [1, 2, 3, 4] });
    });

    it("should handle nested objects correctly", () => {
      const target = { a: { b: { c: 1 } } };
      const source = { a: { b: { d: 2 }, e: 3 } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { b: { c: 1, d: 2 }, e: 3 } });
    });

    it("should overwrite primitive values with objects", () => {
      const target = { a: 1 };
      const source = { a: { b: 2 } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: { b: 2 } });
    });

    it("should overwrite objects with primitive values", () => {
      const target = { a: { b: 1 } };
      const source = { a: 2 };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 2 });
    });

    it("should not modify the original target object", () => {
      const target = { a: 1, b: { c: 2 } };
      const source = { b: { d: 3 } };
      const result = deepMerge(target, source);

      expect(result).toEqual({ a: 1, b: { c: 2, d: 3 } });
    });
  });

  describe("LOG", () => {
    beforeEach(() => {
      // Mock console methods
      vi.resetAllMocks();
      vi.spyOn(console, "log");
      vi.spyOn(console, "warn");
      vi.spyOn(console, "error");
      vi.spyOn(console, "info");
    });

    afterAll(() => {
      vi.resetAllMocks();
    });

    describe("debug", () => {
      it("should call console.log in non-production environment", () => {
        process.env.NODE_ENV = "development";
        LOG.debug("test");
        expect(console.log).toHaveBeenCalledWith("test");
      });

      it("should not call console.log in production environment", () => {
        process.env.NODE_ENV = "production";
        LOG.debug("test");
        expect(console.log).not.toHaveBeenCalled();
      });
    });

    describe("warn", () => {
      it("should call console.warn in non-production environment", () => {
        process.env.NODE_ENV = "development";
        LOG.warn("test");
        expect(console.warn).toHaveBeenCalledWith("test");
      });

      it("should not call console.warn in production environment", () => {
        process.env.NODE_ENV = "production";
        LOG.warn("test");
        expect(console.warn).not.toHaveBeenCalled();
      });
    });

    describe("error", () => {
      it("should always call console.error", () => {
        process.env.NODE_ENV = "development";
        LOG.error("test");
        expect(console.error).toHaveBeenCalledWith("test");

        process.env.NODE_ENV = "production";
        LOG.error("test");
        expect(console.error).toHaveBeenCalledWith("test");
      });
    });

    describe("info", () => {
      it("should call console.info in non-production environment", () => {
        process.env.NODE_ENV = "development";
        LOG.info("test");
        expect(console.info).toHaveBeenCalledWith("test");
      });

      it("should not call console.info in production environment", () => {
        process.env.NODE_ENV = "production";
        LOG.info("test");
        expect(console.info).not.toHaveBeenCalled();
      });
    });
  });
});
