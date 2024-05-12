import { ATHROK_KEY_LABEL } from '../utils/constants';
import { IAthrokStoreConfig, IAthrokStoreListener } from '../utils/types';
import { StorageHandler } from './storage';

export class Master<T> {
  protected listeners: Set<IAthrokStoreListener<T>>; // Set of store listeners
  protected actualState: T | null = null; // Current actual state
  protected initialState: T; // Initial state of the store
  protected storageHandler: StorageHandler | null = null; // Storage handler for persistence
  protected persistName: string | null = null; // Name for persistence

  constructor(initialState: T, config?: IAthrokStoreConfig) {
    this.listeners = new Set<IAthrokStoreListener<T>>();
    this.initialState = initialState;

    // Initialize storage handler if persistence is configured
    if (typeof config?.persist?.name === 'string') {
      this.persistName = `${ATHROK_KEY_LABEL}${config.persist.name}`;
      this.storageHandler = new StorageHandler(this.persistName);
    }
  }

  /**
   * Updates the state of the store with the provided update.
   *
   * This method allows updating the store's state by providing either a new state
   * object directly or a function that generates a new state based on the current state.
   * After updating the state, it notifies all subscribed listeners and persists the
   * updated state data to storage with an optional debounce mechanism.
   *
   * @param update - The new state object or function to generate the new state.
   *
   * @example
   * ```typescript
   * // Define an action to increment the count in the store
   * const incrementCount = () => {
   *   counterStore.setState((currentState) => ({
   *     ...currentState,
   *     count: currentState.count + 1,
   *   }));
   * };
   *
   * // Define an action to set the count to a specific value in the store
   * const setCount = (value: number) => {
   *   counterStore.setState({ count: value });
   * };
   *
   * // Dispatch actions to update the store's state
   * incrementCount(); // Increment the count by 1
   * setCount(10); // Set the count to 10
   * ```
   */

  setState(update: ((currentState: T) => T) | T) {
    this.actualState =
      typeof update === 'function'
        ? (update as (currentState: T) => T)(this.state)
        : (update as T);
    this.listeners.forEach((listener) => listener(this.getState()));

    // Persist state data to storage with optional debounce
    this.storageHandler?.setItem<T>(this.state);
  }

  /**
   * Retrieves the current state of the store.
   *
   * This method returns the current state of the store. If the actual state
   * has not been initialized yet, it retrieves the state from storage, if available,
   * and combines it with the initial state to ensure consistency.
   *
   * @returns The current state of the store.
   *
   * @example
   * ```typescript
   * // Retrieve the current state of the counter store
   * const currentState = counterStore.getState();
   * console.log('Current count:', currentState.count);
   * ```
   */
  getState() {
    return this.state;
  }

  /**
   * Subscribes a listener function to state changes in the store.
   *
   * This method allows registering a listener function that will be called
   * whenever the state of the store changes. It returns a function to unsubscribe
   * the listener when it's no longer needed.
   *
   * @param listener - The listener function to be subscribed.
   * @returns A function to unsubscribe the listener.
   *
   * @example
   * ```typescript
   * // Define a listener function to log state changes
   * const logStateChanges = () => {
   *   console.log('State changed:', counterStore.getState());
   * };
   *
   * // Subscribe the listener to state changes in the counter store
   * const unsubscribe = counterStore.subscribe(logStateChanges);
   *
   * // Dispatch actions to update the store's state
   * counterStore.actions.increment(); // Output: State changed: { count: 1 }
   * counterStore.actions.decrement(); // Output: State changed: { count: 0 }
   *
   * // Unsubscribe the listener when no longer needed
   * unsubscribe();
   * ```
   */
  subscribe(listener: IAthrokStoreListener<T>): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Retrieves the current state of the store, initializing from storage if necessary.
   * @private
   * @returns The current state of the store.
   */
  private get state() {
    if (this.persistName && !this.storageHandler) {
      console.warn(
        `
          try to access storage before initialize
          `
      );
    }
    if (!this.actualState) {
      this.actualState = {
        ...this.initialState,
        ...this.storageHandler?.getItem<T>(),
      };
    }
    return this.actualState;
  }
}
