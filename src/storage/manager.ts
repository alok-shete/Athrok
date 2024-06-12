import { ATHROK_CONFIG_LABEL, ATHROK_KEY_LABEL } from "../utils/constants";
import { ANY, IAthrokAsyncStorage, IAthrokSyncStorage } from "../utils/types";
import { LOG, checkStartString, isPromise } from "../utils/functions";

/**
 * Manages storage and persistence for application data.
 *
 * This class provides methods for initializing storage, setting persistence keys,
 * and synchronizing persistence configuration with the storage.
 */

export class UninitializedStorage implements IAthrokSyncStorage {
  private logWarningAndReturn = <T>(source: string, defaultValue: T) => {
    return (): T => {
      LOG.warn(
        `Attempted to access storage before initialization, method : ${source}`
      );
      return defaultValue;
    };
  };

  getKeys = this.logWarningAndReturn("getKeys", []);
  getItem = this.logWarningAndReturn("getItem", null);
  setItem = this.logWarningAndReturn("setItem", undefined);
  removeItem = this.logWarningAndReturn("removeItem", undefined);
}

export class StorageManager {
  /** The storage interface used for persistence. */
  static storage: IAthrokAsyncStorage | IAthrokSyncStorage =
    new UninitializedStorage();

  /** Holds persistent data mapped by keys. */
  static persistData: Record<
    string,
    {
      value: ANY;
      version?: number;
    }
  > = {};

  /** Set of keys to be persisted. */
  static persistenceKeys: Set<string> = new Set([]);

  static isPersistDataRestored = false;

  /**
   * Constructs a new instance of the StorageManager.
   * @param config - Configuration object containing the storage interface.
   */
  constructor(config: { storage: IAthrokAsyncStorage | IAthrokSyncStorage }) {
    StorageManager.storage = config.storage;
  }

  /**
   * Initializes the StorageManager with the provided configuration.
   *
   * This method retrieves configuration data from storage, sets up persistence keys,
   * and loads persisted data into memory.
   *
   * @param config - Configuration object containing the storage interface.
   */
  static async initialize(config: {
    storage: IAthrokAsyncStorage | IAthrokSyncStorage;
  }) {
    const { storage } = config;
    new StorageManager(config);

    // Retrieve configuration data from storage
    const configDataPromise = storage.getItem(ATHROK_CONFIG_LABEL);
    const isAsync = isPromise(configDataPromise);
    const configDataString = isAsync
      ? await configDataPromise
      : (configDataPromise as string);

    // Parse configuration data and set persistence keys
    const configData: { keys: string[] } = configDataString
      ? JSON.parse(configDataString)
      : {};
    configData.keys?.forEach((key) => StorageManager.persistenceKeys.add(key));
    StorageManager.syncPersistentConfig();

    // Load persisted data into memory
    const allStoragePromises = Promise.all(
      Array.from(StorageManager.persistenceKeys).map(async (key: string) => {
        if (!checkStartString(key, ATHROK_KEY_LABEL)) {
          return;
        }
        const getPromise = storage.getItem(key);

        let value = getPromise as string | null;

        if (isAsync) {
          value = await getPromise;
        }
        if (value) {
          StorageManager.persistData[key] = JSON.parse(value);
        }
      })
    );

    if (isAsync) {
      await allStoragePromises;
    }
    StorageManager.isPersistDataRestored = true;
  }

  /**
   * Adds a key to the set of persistence keys.
   * @param key - The key to be persisted.
   */
  static setPersistenceKey(key: string) {
    StorageManager.persistenceKeys.add(key);
    StorageManager.syncPersistentConfig();
  }

  static clearPersistence(key: string) {
    StorageManager.persistenceKeys.has(key) &&
      StorageManager.persistenceKeys.delete(key);
    StorageManager.storage.removeItem(key);
    StorageManager.syncPersistentConfig();
  }

  /**
   * Synchronizes persistence configuration with the storage.
   *
   * This method updates the configuration data in storage based on the current set
   * of persistence keys.
   */
  private static syncPersistentConfig() {
    if (!(StorageManager.storage instanceof UninitializedStorage)) {
      const data = {
        keys: Array.from(StorageManager.persistenceKeys),
      };
      StorageManager.storage.setItem(ATHROK_CONFIG_LABEL, JSON.stringify(data));
    }
  }
}

export const getPersistanceKeys = () => {
  return Array.from(StorageManager.persistenceKeys);
};

export const clearPersistence = (key: string) => {
  StorageManager.clearPersistence(key);
};
