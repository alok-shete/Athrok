import {
  StorageHandler,
  UninitializedStorageHandler,
} from "../storage/handler";
import { NotFound, isObject, shallowMerge } from "../utils/functions";
import { IAthrokStoreConfig, IAthrokStateListener } from "../utils/types";
export class AthrokMaster<T> {
  protected listeners: Set<IAthrokStateListener<T>>; // Set of store listeners
  protected currentValue: T; // Current actual value
  protected storageHandler: StorageHandler<T> | UninitializedStorageHandler<T> =
    new UninitializedStorageHandler(); // Storage handler for persistence
  protected type: string = "";
  private fetchCurrentState: () => T;

  constructor(initialValue: T, config?: IAthrokStoreConfig<T>) {
    if (new.target === AthrokMaster) {
      throw new Error("Parent class cannot be instantiated directly.");
    }
    this.listeners = new Set<IAthrokStateListener<T>>();
    this.currentValue = initialValue;
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
   * Updates the store's value with the provided update action.
   * @param updateAction - New value or function to update the current value.
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
   * Subscribes a listener to state changes in the store.
   * @param listener - Listener function to be subscribed.
   * @returns Function to unsubscribe the listener.
   */
  subscribe(listener: IAthrokStateListener<T>): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Retrieves the current value of the store.
   * @returns Current value of the store.
   */
  get() {
    return this.fetchCurrentState();
  }

  /**
   * Initializes the store's current value from storage, if available.
   * Handles merging with initial value based on storage configuration.
   */
  private initializeValue = (): T => {
    const storedValue = this.storageHandler.getItem<T>();

    //TODO - need to improve more 
    //TODO - need to check different how the handle this case
    if (
      !(storedValue instanceof NotFound) &&
      this.storageHandler instanceof StorageHandler
    ) {
      if (this.storageHandler.config.merge) {
        this.currentValue = this.storageHandler.config.merge(
          this.currentValue as any,
          storedValue as Object
        ) as T;
      } else {
        switch (this.type) {
          case "AthrokState": {
            if (isObject(this.currentValue) && isObject(storedValue)) {
              this.currentValue = shallowMerge(
                this.currentValue as any,
                storedValue as Object
              ) as T;
            } else {
              this.currentValue = storedValue;
            }
            break;
          }
          case "AthrokStore": {
            this.currentValue = shallowMerge(
              this.currentValue as any,
              storedValue ?? ({} as Object)
            ) as T;
            break;
          }
        }
      }
    }

    // Define a function to fetch the current state
    this.fetchCurrentState = () => {
      return this.currentValue as T;
    };

    return this.currentValue as T;
  };
}
