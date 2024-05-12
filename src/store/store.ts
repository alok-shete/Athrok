import { ANY, IAthrokStoreCallback, IAthrokStoreConfig } from '../utils/types';
import { Master } from './master';

/**
 * Represents a state management store with actions and optional persistence.
 *
 * This class manages the application state, provides methods for updating the state,
 * and supports subscribing to state changes. It can also persist state data to storage
 * with optional debounce functionality.
 *
 * @template T - Type of the store's state.
 * @template R - Type of the store's actions.
 */
export class Store<
  T extends Record<ANY, ANY> = Record<ANY, ANY>,
  R extends Record<ANY, ANY> = Record<ANY, ANY>,
> extends Master<T> {
  actions: R; // Actions available in the store

  /**
   * Constructs a new instance of the Store.
   * @param initialState - The initial state of the store.
   * @param callback - Callback function to generate actions based on store methods.
   * @param config - Optional configuration for persistence.
   */
  constructor(
    initialState: T,
    callback: IAthrokStoreCallback<T, R>,
    config?: IAthrokStoreConfig
  ) {
    super(initialState, config);

    // Generate actions using the provided callback function
    this.actions = callback(
      this.setState.bind(this),
      this.getState.bind(this),
      this
    );
  }
}

export const createStore = <
  T extends Record<ANY, ANY>,
  R extends Record<ANY, ANY>,
>(
  initialState: T,
  callback: IAthrokStoreCallback<T, R>,
  config?: IAthrokStoreConfig
): Store<T, R> => {
  const store = new Store(initialState, callback, config);

  return store;
};

