import { NotFound, isObject, shallowMerge } from '../utils/functions';
import { IAthrokStoreConfig, IAthrokStoreListener } from '../utils/types';
import { StorageHandler } from './storage';

export class Master<T> {
  protected listeners: Set<IAthrokStoreListener<T>>; // Set of store listeners
  protected actualValue: T | null = null; // Current actual value
  protected initialValue: T; // Initial value of the store
  protected storageHandler: StorageHandler<T> | null = null; // Storage handler for persistence
  protected isInitialized = false;
  protected type: string;

  constructor(initialValue: T, config?: IAthrokStoreConfig<T>) {
    if (new.target === Master) {
      throw new Error('Parent class cannot be instantiated directly.');
    }
    this.type = this.constructor.name;
    this.listeners = new Set<IAthrokStoreListener<T>>();
    this.initialValue = initialValue;

    // Initialize storage handler if persistence is configured
    if (typeof config?.persist?.name === 'string') {
      this.storageHandler = new StorageHandler<T>(config.persist);
    }
  }

  /**
   * Updates the value of the store with the provided update.
   *
   * This method allows updating the store's value by providing either a new value
   * object directly or a function that generates a new value based on the current value.
   * After updating the value, it notifies all subscribed listeners and persists the
   * updated value data to storage with an optional debounce mechanism.
   *
   * @param update - The new value object or function to generate the new value.
   *
   * @example
   * ```typescript
   * // Define an action to increment the count in the store
   * const incrementCount = () => {
   *   counterStore.setValue((currentValue) => ({
   *     ...currentValue,
   *     count: currentValue.count + 1,
   *   }));
   * };
   *
   * // Define an action to set the count to a specific value in the store
   * const setCount = (value: number) => {
   *   counterStore.setValue({ count: value });
   * };
   *
   * // Dispatch actions to update the store's value
   * incrementCount(); // Increment the count by 1
   * setCount(10); // Set the count to 10
   * ```
   */

  set(update: ((currentValue: T) => T) | T) {
    this.actualValue =
      typeof update === 'function'
        ? (update as (currentValue: T) => T)(this.get())
        : (update as T);
    this.listeners.forEach((listener) => listener(this.get()));

    // Persist value data to storage with optional debounce

    this.storageHandler?.setItem<T>(this.get());
  }

  /**
   * Retrieves the current value of the store.
   *
   * This method returns the current value of the store. If the actual value
   * has not been initialized yet, it retrieves the value from storage, if available,
   * and combines it with the initial value to ensure consistency.
   *
   * @returns The current value of the store.
   *
   * @example
   * ```typescript
   * // Retrieve the current value of the counter store
   * const currentValue = counterStore.getValue();
   * console.log('Current count:', currentValue.count);
   * ```
   */
  get() {
    if (!this.isInitialized) {
      this.initializeValue();
      this.isInitialized = true;
    }
    return this.actualValue as T;
  }

  /**
   * Subscribes a listener function to value changes in the store.
   *
   * This method allows registering a listener function that will be called
   * whenever the value of the store changes. It returns a function to unsubscribe
   * the listener when it's no longer needed.
   *
   * @param listener - The listener function to be subscribed.
   * @returns A function to unsubscribe the listener.
   *
   * @example
   * ```typescript
   * // Define a listener function to log value changes
   * const logValueChanges = () => {
   *   console.log('Value changed:', counterStore.getValue());
   * };
   *
   * // Subscribe the listener to value changes in the counter store
   * const unsubscribe = counterStore.subscribe(logValueChanges);
   *
   * // Dispatch actions to update the store's value
   * counterStore.actions.increment(); // Output: Value changed: { count: 1 }
   * counterStore.actions.decrement(); // Output: Value changed: { count: 0 }
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
   * Retrieves the current value of the store, initializing from storage if necessary.
   * @private
   * @returns The current value of the store.
   */
  private initializeValue() {
    this.actualValue = this.initialValue;
    const storedValue = this.storageHandler
      ? this.storageHandler?.getItem<T>()
      : new NotFound();
    this.storageHandler;

    if (!(storedValue instanceof NotFound)) {
      const mergeFunction = this.storageHandler?.config.merge ?? shallowMerge;
      switch (this.type) {
        case 'State': {
          if (isObject(this.initialValue) && isObject(storedValue)) {
            this.actualValue = mergeFunction(
              this.actualValue as any,
              storedValue as Object
            ) as T;
          } else {
            this.actualValue = storedValue;
          }

          break;
        }
        case 'Store': {
          this.actualValue = mergeFunction(
            this.actualValue as any,
            storedValue ?? ({} as Object)
          ) as T;

          break;
        }
      }
    }

    return this.actualValue as T;
  }
}
