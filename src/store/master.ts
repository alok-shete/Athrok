import {
  StorageHandler,
  UninitializedStorageHandler,
} from "../storage/handler";
import { NotFound, isObject } from "../utils/functions";
import { IAthrokStoreConfig, IAthrokStoreListener } from "../utils/types";
export class AthrokMaster<T> {
  protected listeners: Set<IAthrokStoreListener<T>>; // Set of store listeners
  protected currentValue: T; // Current actual value
  protected initialValue: T; // Initial value of the store
  protected storageHandler: StorageHandler<T> | UninitializedStorageHandler<T> =
    new UninitializedStorageHandler(); // Storage handler for persistence
  protected type: string = "";
  private fetchCurrentState: () => T;

  constructor(initialValue: T, config?: IAthrokStoreConfig<T>) {
    if (new.target === AthrokMaster) {
      throw new Error("Parent class cannot be instantiated directly.");
    }
    // this.type = this.constructor.name;
    this.listeners = new Set<IAthrokStoreListener<T>>();
    this.initialValue = initialValue; // need to deep clone
    this.currentValue = this.initialValue;
    this.set = this.set.bind(this);
    this.subscribe = this.subscribe.bind(this);
    this.get = this.get.bind(this);
    this.fetchCurrentState = this.initializeValue;

    // Initialize storage handler if persistence is configured
    if (typeof config?.name === "string" && config.persist?.enable) {
      this.storageHandler = new StorageHandler<T>(config.name, config.persist);
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

  set(updateAction: React.SetStateAction<T>) {
    this.fetchCurrentState();
    this.currentValue =
      typeof updateAction === "function"
        ? (updateAction as (prevState: T) => T)(this.currentValue)
        : updateAction;
    this.listeners.forEach((listener) => listener(this.currentValue));

    // Persist the current value to storage with optional debounce
    this.storageHandler.setItem<T>(this.currentValue);
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
    // Add the listener to the set of listeners
    this.listeners.add(listener);

    // Return a function to unsubscribe the listener
    return () => {
      this.listeners.delete(listener);
    };
  }

  get() {
    return this.fetchCurrentState();
  }

  /**
   * Retrieves the current value of the store, initializing from storage if necessary.
   * @private
   * @returns The current value of the store.
   */
  private initializeValue = () => {
    const storedValue = this.storageHandler.getItem<T>();
    if (
      !(storedValue instanceof NotFound) &&
      this.storageHandler instanceof StorageHandler
    ) {
      switch (this.type) {
        case "AthrokState": {
          if (isObject(this.initialValue) && isObject(storedValue)) {
            this.currentValue = this.storageHandler.config.merge(
              this.currentValue as any,
              storedValue as Object
            ) as T;
          } else {
            this.currentValue = storedValue;
          }

          break;
        }
        case "AthrokStore": {
          this.currentValue = this.storageHandler.config.merge(
            this.currentValue as any,
            storedValue ?? ({} as Object)
          ) as T;

          break;
        }
      }
    }

    this.fetchCurrentState = () => {
      return this.currentValue as T;
    };

    return this.currentValue as T;
  };
}
