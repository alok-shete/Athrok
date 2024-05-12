import { Store } from "../store/store";

/**
 * Represents any type.
 * @typedef ANY
 * @type {any}
 */
export type ANY = any;

/**
 * Defines the signature of a listener function with no parameters and no return value.
 * @typedef IAthrokStoreListener
 * @type {() => void}
 */
export type IAthrokStoreListener<T> = (state:T) => void;

/**
 * Configuration for persisting the state of the store.
 * @interface IAthrokPersistConfig
 */
export interface IAthrokPersistConfig {
  /** Name identifier for the persisted state. */
  name: string;
  /** Optional debounce time in milliseconds for reducing the frequency of state persistence (default is 200ms). */
  debounceTime?: number;
}

/**
 * Configuration options for the store.
 * @interface IAthrokStoreConfig
 */
export interface IAthrokStoreConfig {
  /** Optional configuration for persisting the state. */
  persist?: IAthrokPersistConfig;
}

/**
 * Interface for synchronous storage operations.
 * @interface IAthrokSyncStorage
 */
export interface IAthrokSyncStorage {
  /** Retrieves all keys from the storage. */
  getKeys: () => string[];
  /** Retrieves the value associated with the given key from the storage. */
  getItem: (name: string) => string | null;
  /** Sets the value for the given key in the storage. */
  setItem: (name: string, value: string) => void;
  /** Removes the value associated with the given key from the storage. */
  removeItem: (name: string) => void;
}

/**
 * Interface for asynchronous storage operations.
 * @interface IAthrokAsyncStorage
 */
export interface IAthrokAsyncStorage {
  /** Retrieves all keys from the storage asynchronously. */
  getKeys: () => Promise<string[]> | Promise<readonly string[]>;
  /** Retrieves the value associated with the given key from the storage asynchronously. */
  getItem: (name: string) => Promise<string | null>;
  /** Sets the value for the given key in the storage asynchronously. */
  setItem: (name: string, value: string) => Promise<void>;
  /** Removes the value associated with the given key from the storage asynchronously. */
  removeItem: (name: string) => Promise<void>;
}

/**
 * Represents a callback function that operates on the store.
 * @typedef IAthrokStoreCallback
 * @template T - Type of the state.
 * @template R - Type of the return value.
 * @type {(setState: (update: ((currentState: T) => T) | T) => void, getState: () => T, store: Store<T, R>) => R}
 */
export type IAthrokStoreCallback<
  T extends Record<string, ANY> = Record<string, ANY>,
  R extends Record<string, ANY> = Record<string, ANY>,
> = (
  setState: (update: ((currentState: T) => T) | T) => void,
  getState: () => T,
  store: Store<T, R>
) => R;

/**
 * Represents a function to set the state of the store.
 * @typedef IAthrokSetState
 * @template T - Type of the state.
 * @type {(update: T | ((currentState: T) => T)) => void}
 */
export type IAthrokSetState<T = ANY> = (
  update: T | ((currentState: T) => T)
) => void;

/**
 * Represents a function to get the current state of the store.
 * @typedef IAthrokGetState
 * @template T - Type of the state.
 * @type {() => T}
 */
export type IAthrokGetState<T = ANY> = () => T;

/**
 * Represents a function to get actions from the store.
 * @typedef IAthrokGetActions
 * @template R - Type of the actions.
 * @type {() => R}
 */
export type IAthrokGetActions<R = ANY> = () => R;
