import { ATHROK_KEY_LABEL } from "../utils/constants";
import { NotFound, isObject, shallowMerge } from "../utils/functions";
import { ANY, IAthrokPersistConfig, PartiallyRequired } from "../utils/types";
import { StorageManager } from "./manager";

/**
 * Manages data storage and persistence for a specific key.
 *
 * This class provides methods for getting and setting data associated with a key,
 * and automatically persists the data to storage with a debounce mechanism.
 */

export class UninitializedStorageHandler<T> {
  config: IAthrokPersistConfig<T> = {
    enable: false,
  };
  getItem = () => new NotFound();
  setItem = () => {};
}
export class StorageHandler<T> {
  #key: string; // The key associated with the stored data
  #timeoutId: NodeJS.Timeout | undefined; // Timeout ID for debounce mechanism
  config: PartiallyRequired<
    IAthrokPersistConfig<T>,
    "debounceTime" | "partial" | "merge"
  >;

  /**
   * Constructs a new instance of the StorageHandler.
   * @param key - The key associated with the stored data.
   */
  constructor(storeName: string, persisConfig: IAthrokPersistConfig<T>) {
    this.#key = `${ATHROK_KEY_LABEL}${storeName}`;
    this.config = {
      debounceTime: 100,
      partial: (data) => data,
      merge: shallowMerge,
      ...persisConfig,
    };
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
    const { value, version } = StorageManager.persistData[this.#key];

    if (this.config.version == version) {
      return value as T;
    }

    if (this.config.migrate) {
      return this.config.migrate(value) as T;
    }

    return new NotFound();
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
      const partialData = this.config.partial(data as ANY);

      StorageManager.storage.setItem(
        this.#key,
        JSON.stringify({
          value: partialData,
          version: version,
        })
      );
    }, this.config.debounceTime); // Debounce time: 100ms
  }
}
