import { ANY, IAthrokStoreCallback, IAthrokStoreConfig } from "../utils/types";
import { AthrokMaster } from "./master";

/**
 * Represents a value management store with actions and optional persistence.
 *
 * This class manages the application value, provides methods for updating the value,
 * and supports subscribing to value changes. It can also persist value data to storage
 * with optional debounce functionality.
 *
 * @template T - Type of the store's value.
 * @template R - Type of the store's actions.
 */
export class AthrokStore<
  T extends Record<ANY, ANY> = Record<ANY, ANY>,
  R extends Record<ANY, ANY> = Record<ANY, ANY>,
> extends AthrokMaster<T> {
  actions: R; // Actions available in the store

  /**
   * Constructs a new instance of the AthrokStore.
   * @param initialState - The initial value of the store.
   * @param callback - Callback function to generate actions based on store methods.
   * @param config - Optional configuration for persistence.
   */
  constructor(
    initialState: T,
    callback: IAthrokStoreCallback<T, R>,
    config?: IAthrokStoreConfig<T>
  ) {
    super(initialState, config);
    this.type = "AthrokStore";

    // Generate actions using the provided callback function
    this.actions = callback(this.set.bind(this), this.get.bind(this), this);
  }
}

export const createStore = <
  T extends Record<ANY, ANY>,
  R extends Record<ANY, ANY>,
>(
  initialState: T,
  callback: IAthrokStoreCallback<T, R>,
  config?: IAthrokStoreConfig<T>
): AthrokStore<T, R> => {
  const store = new AthrokStore(initialState, callback, config);

  return store;
};
