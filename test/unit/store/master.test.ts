import { vi } from "vitest";
import { StorageHandler } from "../../../src/storage/handler";
import { AthrokMaster } from "../../../src/store/master";
import { IAthrokStoreConfig } from "../../../src/utils/types";

interface TestValue {
  key: string;
  value: number;
}

class TestAthrokMaster extends AthrokMaster<TestValue> {
  constructor(initialValue: TestValue, config?: IAthrokStoreConfig<TestValue>) {
    super(initialValue, config);
  }
}
describe("AthrokMaster", () => {
  describe("constructor", () => {
    it("should prevent direct instantiation of parent class", () => {
      expect(() => new AthrokMaster("test")).toThrowError(
        "Parent class cannot be instantiated directly."
      );
    });

    it("should initialize with correct initial value and listeners", () => {
      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(initialValue);
      expect(master["initialValue"]).toBe(initialValue);
      expect(master["listeners"].size).toBe(0); // Initially, no listeners are added
    });

    it("should initialize storage handler based on config", () => {
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(initialValue, config);
      expect(master["storageHandler"] instanceof StorageHandler).toBeTruthy();
    });
  });
  describe("set method", () => {
    it("should handle function update action correctly", () => {
      const initialValue = { key: "testKey", value: 42 };
      const newValue = { value: 999 };
      const master = new TestAthrokMaster(initialValue);

      const listenerMock = vi.fn();

      master.subscribe(listenerMock);

      vi.spyOn(master["storageHandler"], "setItem");

      master.set((pre) => ({ ...pre, ...newValue }));
      expect(master["currentValue"]).toEqual({
        key: "testKey",
        value: 999,
      });
      expect(listenerMock).toHaveBeenCalledWith({
        key: "testKey",
        value: 999,
      });
      expect(master["storageHandler"].setItem).toHaveBeenCalledWith({
        key: "testKey",
        value: 999,
      });
    });

    it("should handle direct value update action correctly", () => {
      const initialValue = { key: "testKey", value: 42 };
      const newValue = { key: "newTestKey", value: 999 };
      const master = new TestAthrokMaster(initialValue);

      const listenerMock = vi.fn();

      master.subscribe(listenerMock);

      vi.spyOn(master["storageHandler"], "setItem");

      master.set(newValue);
      expect(master["currentValue"]).toEqual(newValue);
      expect(listenerMock).toHaveBeenCalledWith(newValue);
      expect(master["storageHandler"].setItem).toHaveBeenCalledWith(newValue);
    });
  });

  describe(" subscribe method", () => {
    it("should add the listener to the set of listeners", () => {
      const initialValue = { key: "testKey", value: 42 };

      const master = new TestAthrokMaster(initialValue);
      const mockListener = vi.fn();
      const unsubscribe = master.subscribe(mockListener);

      expect(master["listeners"].has(mockListener)).toBeTruthy();
      expect(unsubscribe).toBeDefined();
    });

    it("should return a function to unsubscribe the listener", () => {
      const initialValue = { key: "testKey", value: 42 };

      const master = new TestAthrokMaster(initialValue);
      const mockListener = vi.fn();
      const unsubscribe = master.subscribe(mockListener);

      expect(master["listeners"].has(mockListener)).toBeTruthy();

      // Call the unsubscribe function
      unsubscribe();

      expect(master["listeners"].has(mockListener)).toBeFalsy();
    });
  });

  describe("get method", () => {
    it("should use the initial value when no stored value exists", () => {
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(initialValue, config);

      const storageHandlerGetItemMock = vi.spyOn(
        master["storageHandler"],
        "getItem"
      );

      storageHandlerGetItemMock.mockReturnValue(null);
      const result = master.get();
      expect(result).toBe(initialValue);
      expect(storageHandlerGetItemMock).toHaveBeenCalledTimes(1);
    });

    it("should use the initial value when no stored value exists and again call get", () => {
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(initialValue, config);

      const storageHandlerGetItemMock = vi.spyOn(
        master["storageHandler"],
        "getItem"
      );

      storageHandlerGetItemMock.mockReturnValue(null);
      expect(master.get()).toBe(initialValue);
      expect(master.get()).toBe(initialValue);
      expect(storageHandlerGetItemMock).toHaveBeenCalledTimes(1);
    });

    it("should merge stored value with initial value as key value pair for AthrokState", () => {
      const storedValue = { key: "value" };
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(
        JSON.parse(JSON.stringify(initialValue)),
        config
      );
      master["type"] = "AthrokState";

      const storageHandlerGetItemMock = vi.spyOn(
        master["storageHandler"],
        "getItem"
      );

      storageHandlerGetItemMock.mockReturnValue(storedValue);
      // mockStorageHandler.config.merge.mockImplementation((a, b) => ({...a,...b }));

      const result = master.get();

      console.log(result);
      expect(result).toEqual({ ...initialValue, ...storedValue });
      expect(storageHandlerGetItemMock).toHaveBeenCalledTimes(1);
      // expect(mockStorageHandler.config.merge).toHaveBeenCalledTimes(1);
    });

    it("should merge stored value with initial value as single value for AthrokState", () => {
      const storedValue = 20;
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = 10;
      const master = new TestAthrokMaster(
        JSON.parse(JSON.stringify(initialValue)),
        config
      );
      master["type"] = "AthrokState";

      const storageHandlerGetItemMock = vi.spyOn(
        master["storageHandler"],
        "getItem"
      );

      storageHandlerGetItemMock.mockReturnValue(storedValue);
      const result = master.get();

      console.log(result);
      expect(result).toBe(20);
      expect(storageHandlerGetItemMock).toHaveBeenCalledTimes(1);
    });

    it("should merge stored value with initial value as key value pair for AthrokStore", () => {
      const storedValue = { key: "value" };
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(
        JSON.parse(JSON.stringify(initialValue)),
        config
      );
      master["type"] = "AthrokStore";

      const storageHandlerGetItemMock = vi.spyOn(
        master["storageHandler"],
        "getItem"
      );

      storageHandlerGetItemMock.mockReturnValue(storedValue);
      const result = master.get();

      console.log(result);
      expect(result).toEqual({ ...initialValue, ...storedValue });
      expect(storageHandlerGetItemMock).toHaveBeenCalledTimes(1);
    });

    it("should merge stored value with initial value as undefined for AthrokStore", () => {
      const storedValue = undefined;
      const config = {
        name: "testName",
        persist: { enable: true },
      };

      const initialValue = { key: "testKey", value: 42 };
      const master = new TestAthrokMaster(
        JSON.parse(JSON.stringify(initialValue)),
        config
      );
      master["type"] = "AthrokStore";

      const storageHandlerGetItemMock = vi.spyOn(
        master["storageHandler"],
        "getItem"
      );

      storageHandlerGetItemMock.mockReturnValue(storedValue);
      const result = master.get();

      console.log(result);
      expect(result).toEqual({ ...initialValue });
      expect(storageHandlerGetItemMock).toHaveBeenCalledTimes(1);
    });
  });
});
