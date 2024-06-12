import "../../__mock__/storageManager.mock";
import { describe, it, vi } from "vitest";
import {
  StorageHandler,
  UninitializedStorageHandler,
} from "../../../src/storage/handler";
import { StorageManager } from "../../../src/storage/manager";
import { ATHROK_KEY_LABEL } from "../../../src/utils/constants";
import { NotFound } from "../../../src/utils/functions";

describe("StorageHandler", () => {
  beforeEach(() => {
    StorageManager.storage = {
      setItem: vi.fn(),
      getItem: vi.fn(),
    } as any;
    StorageManager.persistData = {};
    StorageManager.isPersistDataRestored = false;
    StorageManager.persistenceKeys = new Set([]);
  });
  afterEach(() => {
    vi.clearAllMocks();
    vi.useRealTimers();
  });

  it("should initialize with the correct key and configuration", () => {
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
    };
    vi.spyOn(StorageManager, "setPersistenceKey");
    const handler = new StorageHandler(storeName, config);

    expect(StorageManager.setPersistenceKey).toHaveBeenCalledWith(
      `${ATHROK_KEY_LABEL}${storeName}`
    );
    expect(handler.config).toEqual({
      partial: expect.any(Function),
      merge: expect.any(Function),
      ...config,
    });
  });

  it("should retrieve stored data correctly", () => {
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
    };
    const handler = new StorageHandler(storeName, config);
    const storedData = { value: { key: "value" }, version: 1 };
    StorageManager.persistData[`${ATHROK_KEY_LABEL}${storeName}`] = storedData;

    const result = handler.getItem();

    expect(result).toEqual(storedData.value);
  });

  it("should return NotFound when data is not found", () => {
    const storeName = "testStoreNoData";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
    };
    const handler = new StorageHandler(storeName, config);
    const result = handler.getItem();

    expect(result).toBeInstanceOf(NotFound);
  });

  it("should return migrated data when versions do not match", () => {
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
      migrate: vi.fn().mockReturnValue({ key: "newValue" }),
    };
    const handler = new StorageHandler(storeName, config);
    const storedData = { value: { key: "oldValue" }, version: 0 };
    StorageManager.persistData[`${ATHROK_KEY_LABEL}${storeName}`] = storedData;

    const result = handler.getItem();

    expect(config.migrate).toHaveBeenCalledWith(storedData.value);
    expect(result).toEqual({ key: "newValue" });
  });

  it("should return migrated data when versions do not match and migration function not found ", () => {
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
    };
    const handler = new StorageHandler(storeName, config);
    const storedData = { value: { key: "oldValue" }, version: 0 };
    StorageManager.persistData[`${ATHROK_KEY_LABEL}${storeName}`] = storedData;

    const result = handler.getItem();
    expect(result).toBeInstanceOf(NotFound);
  });

  it("should set stored data with debounce mechanism", () => {
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
      migrate: vi.fn().mockReturnValue({ key: "newValue" }),
    };
    const handler = new StorageHandler(storeName, config);
    vi.useFakeTimers();
    const data = { key: "newValue" };

    handler.setItem(data);

    vi.runAllTimers();

    expect(StorageManager.storage.setItem).toHaveBeenCalledWith(
      `${ATHROK_KEY_LABEL}${storeName}`,
      JSON.stringify({ value: data, version: config.version })
    );
  });

  it("should set stored data with debounce mechanism and default value", () => {
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      migrate: vi.fn().mockReturnValue({ key: "newValue" }),
    };
    const handler = new StorageHandler(storeName, config);
    vi.useFakeTimers();
    const data = { key: "newValue" };

    handler.setItem(data);

    vi.runAllTimers();

    expect(StorageManager.storage.setItem).toHaveBeenCalledWith(
      `${ATHROK_KEY_LABEL}${storeName}`,
      JSON.stringify({ value: data, version: config.version })
    );
  });

  it("should clear previous timeout when setting data", () => {
    const data = { key: "newValue" };
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
    };
    const handler = new StorageHandler(storeName, config);
    vi.useFakeTimers();
    handler.setItem(data);
    handler.setItem(data);
    vi.runAllTimers();
    expect(StorageManager.storage.setItem).toHaveBeenCalledTimes(1);
  });

  it("should handle partial data if partial config is provided", () => {
    vi.useFakeTimers();
    const data = { key: "newValue", extra: "data" };
    const storeName = "testStore";
    const config = {
      enable: true,
      version: 1,
      debounceTime: 100,
      partial: vi.fn().mockReturnValue({ key: "newValue" }),
    };
    const handler = new StorageHandler(storeName, config);
    handler.setItem(data);

    vi.runAllTimers();

    expect(StorageManager.storage.setItem).toHaveBeenCalledWith(
      `${ATHROK_KEY_LABEL}${storeName}`,
      JSON.stringify({ value: { key: "newValue" }, version: config.version })
    );
  });
});

describe("UninitializedStorageHandler", () => {
  it("should initialize with config.enable set to false", () => {
    const handler = new UninitializedStorageHandler<number>();
    expect(handler.config.enable).toBe(false);
  });

  it("should return a new NotFound instance when getItem is called", () => {
    const handler = new UninitializedStorageHandler<number>();
    const item = handler.getItem();
    expect(item).toBeInstanceOf(NotFound);
  });

  it("should accept data in setItem without throwing errors", () => {
    const handler = new UninitializedStorageHandler<number>();
    expect(() => handler.setItem()).not.toThrow();
  });
});
