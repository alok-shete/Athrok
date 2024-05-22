import { ATHROK_CONFIG_LABEL, ATHROK_KEY_LABEL } from '../utils/constants';
import {
  NotFound,
  checkStartString,
  isObject,
  isPromise,
} from '../utils/functions';
import {
  ANY,
  IAthrokAsyncStorage,
  IAthrokPersistConfig,
  IAthrokSyncStorage,
} from '../utils/types';

/**
 * Manages storage and persistence for application data.
 *
 * This class provides methods for initializing storage, setting persistence keys,
 * and synchronizing persistence configuration with the storage.
 */
export class StorageManager {
  /** The storage interface used for persistence. */
  static storage: IAthrokAsyncStorage | IAthrokSyncStorage | null = null;

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
        const getPromise = storage.getItem(key);
        const value = isAsync ? await getPromise : (getPromise as string);
        if (value && checkStartString(key, ATHROK_KEY_LABEL)) {
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
    StorageManager.storage?.removeItem(key);
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
export class StorageHandler<T> {
  #key: string; // The key associated with the stored data
  #timeoutId: NodeJS.Timeout | undefined; // Timeout ID for debounce mechanism
  config: IAthrokPersistConfig<T>;

  /**
   * Constructs a new instance of the StorageHandler.
   * @param key - The key associated with the stored data.
   */
  constructor(persisConfig: IAthrokPersistConfig<T>) {
    this.#key = `${ATHROK_KEY_LABEL}${persisConfig.name}`;
    this.config = persisConfig;
    StorageManager.setPersistenceKey(this.#key); // Set the key for persistence
  }

  /**
   * Retrieves the stored data associated with the key.
   * @returns The stored data or an empty object if data is not found.
   * @template T - The type of the stored data.
   */
  public getItem<T>(): T | NotFound {
    if (!isObject(StorageManager.persistData[this.#key])) {
      return new NotFound() as T;
    }
    const { value, version } = StorageManager.persistData[this.#key] ?? {};

    if (this.config.version !== version) {
      if (this.config.migrate) {
        return this.config.migrate(value) as T;
      }
      return new NotFound();
    }

    return value as T;
  }

  /**
   * Sets the stored data associated with the key with a debounce mechanism.
   * @param data - The data to be stored.
   * @template T - The type of the data to be stored.
   */
  public setItem<T>(data: T) {
    clearTimeout(this.#timeoutId); // Clear previous timeout
    this.#timeoutId = setTimeout(() => {
      const version = this.config.version;
      // Set new timeout for debounce mechanism
      const partialData = this.config.partial
        ? this.config.partial(data as ANY)
        : data;

      StorageManager.storage?.setItem(
        this.#key,
        JSON.stringify({
          value: partialData,
          version: version,
        })
      );
    }, this.config.debounceTime ?? 100); // Debounce time: 100ms
  }
}

export const getPersistanceKeys = () => {
  return Array.from(StorageManager.persistenceKeys);
};

export const clearPersistence = (key: string) => {
  StorageManager.clearPersistence(key);
};
