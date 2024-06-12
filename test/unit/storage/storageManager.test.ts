import { describe, it, vi } from "vitest";
import {
  StorageManager,
  UninitializedStorage,
  clearPersistence,
  getPersistanceKeys,
} from "../../../src/storage/manager";
import {
  ATHROK_CONFIG_LABEL,
  ATHROK_KEY_LABEL,
} from "../../../src/utils/constants";

import asyncStorageMock from "../../__mock__/asyncStorage.mock";
import syncStorageMock from "../../__mock__/syncStorage.mock";
import { LOG } from "../../../src/utils/functions";

// Mock storage interfaces

beforeEach(() => {
  [asyncStorageMock, syncStorageMock].forEach((mock) => mock.restoreAllMock());
  StorageManager.persistData = {};
  StorageManager.persistenceKeys.clear();
  StorageManager.storage = new UninitializedStorage();
  StorageManager.isPersistDataRestored = false;
});

describe("StorageManager", () => {
  it("should initialize with the correct async storage configuration ", async () => {
    asyncStorageMock.getItemMock.mockResolvedValueOnce(
      JSON.stringify({ keys: [`${ATHROK_KEY_LABEL}testKey`] })
    );
    asyncStorageMock.getItemMock.mockResolvedValue(
      JSON.stringify({ value: 1 })
    );

    await StorageManager.initialize({ storage: asyncStorageMock.create() });

    expect(StorageManager.storage).toBe(asyncStorageMock.create());
    expect(asyncStorageMock.getItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL
    );
    expect(StorageManager.isPersistDataRestored).toBe(true);

    expect(StorageManager.persistData).toEqual({
      [`${ATHROK_KEY_LABEL}testKey`]: { value: 1 },
    });
  });

  it("should initialize with the correct sync storage configuration ", async () => {
    syncStorageMock.getItemMock.mockReturnValueOnce(
      JSON.stringify({ keys: [`${ATHROK_KEY_LABEL}testKey`] })
    );
    syncStorageMock.getItemMock.mockReturnValue(JSON.stringify({ value: 1 }));

    StorageManager.initialize({ storage: syncStorageMock.create() });
    expect(StorageManager.storage).toBe(syncStorageMock.create());
    expect(syncStorageMock.getItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL
    );
    expect(StorageManager.isPersistDataRestored).toBe(true);

    expect(StorageManager.persistData).toEqual({
      [`${ATHROK_KEY_LABEL}testKey`]: { value: 1 },
    });
  });

  it("should initialize with the correct async storage null configuration ", async () => {
    asyncStorageMock.getItemMock.mockResolvedValueOnce(null);

    await StorageManager.initialize({ storage: asyncStorageMock.create() });

    expect(StorageManager.storage).toBe(asyncStorageMock.create());
    expect(asyncStorageMock.getItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL
    );
    expect(StorageManager.isPersistDataRestored).toBe(true);

    expect(StorageManager.persistData).toEqual({});
  });

  it("should add a key to the persistence keys", () => {
    StorageManager.storage = syncStorageMock.create();
    const key = "testKey";

    StorageManager.setPersistenceKey(key);

    expect(StorageManager.persistenceKeys.has(key)).toBe(true);
    expect(syncStorageMock.setItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL,
      JSON.stringify({ keys: [key] })
    );
  });

  it("should clear a key from persistence keys", () => {
    StorageManager.storage = syncStorageMock.create();
    const key = "testKey";
    StorageManager.persistenceKeys.add(key);

    StorageManager.clearPersistence(key);

    expect(StorageManager.persistenceKeys.has(key)).toBe(false);
    expect(syncStorageMock.removeItemMock).toHaveBeenCalledWith(key);
    expect(syncStorageMock.setItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL,
      JSON.stringify({ keys: [] })
    );
  });

  it("should sync persistent configuration", () => {
    StorageManager.storage = syncStorageMock.create();
    const key1 = "testKey1";
    const key2 = "testKey2";
    StorageManager.persistenceKeys.add(key1);
    StorageManager.persistenceKeys.add(key2);

    StorageManager["syncPersistentConfig"]();

    expect(syncStorageMock.setItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL,
      JSON.stringify({ keys: [key1, key2] })
    );
  });

  it("should load persisted data into memory", async () => {
    const persistedData = JSON.stringify({
      value: { key: "value" },
      version: 1,
    });

    asyncStorageMock.getItemMock.mockResolvedValue(persistedData);

    StorageManager.persistenceKeys.add(`${ATHROK_KEY_LABEL}testKey`);

    await StorageManager.initialize({ storage: asyncStorageMock.create() });

    expect(StorageManager.persistData[`${ATHROK_KEY_LABEL}testKey`]).toEqual(
      JSON.parse(persistedData)
    );
    expect(StorageManager.isPersistDataRestored).toBe(true);
  });

  it("should not load data with incorrect prefix", async () => {
    const persistedData = JSON.stringify({
      value: { key: "value" },
      version: 1,
    });
    asyncStorageMock.getItemMock.mockResolvedValue(persistedData);

    StorageManager.persistenceKeys.add("testKey");

    await StorageManager.initialize({ storage: asyncStorageMock.create() });

    expect(StorageManager.persistData["testKey"]).toBeUndefined();
  });
});

describe("getPersistanceKeys", () => {
  it("should get all persistence keys", () => {
    const key1 = "testKey1";
    const key2 = "testKey2";
    StorageManager.persistenceKeys.add(key1);
    StorageManager.persistenceKeys.add(key2);

    const keys = getPersistanceKeys();

    expect(keys).toContain(key1);
    expect(keys).toContain(key2);
    expect(keys.length).toBe(2);
  });
});

describe("clearPersistence", () => {
  it("should clear persistence for a specific key", () => {
    StorageManager.storage = syncStorageMock.create();
    const key = "testKey";
    StorageManager.persistenceKeys.add(key);

    clearPersistence(key);

    expect(StorageManager.persistenceKeys.has(key)).toBe(false);
    expect(syncStorageMock.removeItemMock).toHaveBeenCalledWith(key);
    expect(syncStorageMock.setItemMock).toHaveBeenCalledWith(
      ATHROK_CONFIG_LABEL,
      JSON.stringify({ keys: [] })
    );
  });
});

describe("UninitializedStorage", () => {
  let uninitializedStorage: UninitializedStorage;

  beforeEach(() => {
    vi.spyOn(LOG, "debug");
    vi.spyOn(LOG, "error");
    vi.spyOn(LOG, "info");
    vi.spyOn(LOG, "warn");
    uninitializedStorage = new UninitializedStorage();
  });

  afterEach(() => {
    vi.clearAllMocks(); // Clear mocks after each test
  });

  describe("when storage is uninitialized", () => {
    it("should log a warning and return default value for getKeys", () => {
      const result = uninitializedStorage.getKeys();
      expect(LOG.warn).toHaveBeenCalled();
      expect(result).toEqual([]);
    });

    it("should log a warning and return null for getItem", () => {
      const result = uninitializedStorage.getItem();
      expect(LOG.warn).toHaveBeenCalled();
      expect(result).toBeNull();
    });

    it("should log a warning but not change state for setItem", () => {
      uninitializedStorage.setItem();
      expect(LOG.warn).toHaveBeenCalled();
      // No expectation here because setItem doesn't change state
    });

    it("should log a warning but not change state for removeItem", () => {
      uninitializedStorage.removeItem();
      expect(LOG.warn).toHaveBeenCalled();
      // No expectation here because removeItem doesn't change state
    });
  });
});
