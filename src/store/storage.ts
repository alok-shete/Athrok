import { ATHROK_CONFIG_LABEL, ATHROK_KEY_LABEL } from '../utils/constants';
import { checkStartString, isPromise } from '../utils/functions';
import { ANY, IAthrokAsyncStorage, IAthrokSyncStorage } from '../utils/types';

/**
 * Manages storage and persistence for application data.
 *
 * This class provides methods for initializing storage, setting persistence keys,
 * and synchronizing persistence configuration with the storage.
 */
export class StorageManager {
  /** The singleton instance of the StorageManager. */
  static Instance: StorageManager | null = null;

  /** The storage interface used for persistence. */
  static storage: IAthrokAsyncStorage | IAthrokSyncStorage | null = null;

  /** Holds persistent data mapped by keys. */
  static persistData: Record<string, ANY> = {};

  /** Set of keys to be persisted. */
  private static persistenceKeys: Set<string> = new Set([]);

  /**
   * Constructs a new instance of the StorageManager.
   * @param config - Configuration object containing the storage interface.
   */
  constructor(config: { storage: IAthrokAsyncStorage | IAthrokSyncStorage }) {
    StorageManager.Instance = this;
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
    await Promise.all(
      Array.from(StorageManager.persistenceKeys).map(async (key: string) => {
        const value = isAsync
          ? await storage.getItem(key)
          : (storage.getItem(key) as string);
        if (value && checkStartString(key, ATHROK_KEY_LABEL)) {
          StorageManager.persistData[key] = JSON.parse(value);
        }
      })
    );
  }

  /**
   * Adds a key to the set of persistence keys.
   * @param key - The key to be persisted.
   */
  static setPersistenceKey(key: string) {
    StorageManager.persistenceKeys.add(key);
    StorageManager.syncPersistentConfig();
  }

  /**
   * Synchronizes persistence configuration with the storage.
   *
   * This method updates the configuration data in storage based on the current set
   * of persistence keys.
   */
  private static syncPersistentConfig() {
    const data = {
      keys: Array.from(StorageManager.persistenceKeys),
    };
    StorageManager.storage?.setItem(ATHROK_CONFIG_LABEL, JSON.stringify(data));
  }
}

/**
 * Manages data storage and persistence for a specific key.
 *
 * This class provides methods for getting and setting data associated with a key,
 * and automatically persists the data to storage with a debounce mechanism.
 */
export class StorageHandler {
  #key: string; // The key associated with the stored data
  #timeoutId: number | undefined; // Timeout ID for debounce mechanism

  /**
   * Constructs a new instance of the StorageHandler.
   * @param key - The key associated with the stored data.
   */
  constructor(key: string) {
    this.#key = key;
    StorageManager.setPersistenceKey(key); // Set the key for persistence
  }

  /**
   * Retrieves the stored data associated with the key.
   * @returns The stored data or an empty object if data is not found.
   * @template T - The type of the stored data.
   */
  public getItem<T>(): T {
    return (StorageManager.persistData[this.#key] ?? {}) as T;
  }

  /**
   * Sets the stored data associated with the key with a debounce mechanism.
   * @param data - The data to be stored.
   * @template T - The type of the data to be stored.
   */
  public setItem<T>(data: T) {
    clearTimeout(this.#timeoutId); // Clear previous timeout
    this.#timeoutId = setTimeout(() => {
      // Set new timeout for debounce mechanism
      StorageManager.storage?.setItem(this.#key, JSON.stringify(data));
    }, 100); // Debounce time: 100ms
  }
}
