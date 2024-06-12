import { AthrokStore } from "../store/store";

/**
 * Represents any type.
 * @typedef ANY
 * @type {any}
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any;

/**
 * Defines the signature of a listener function with no parameters and no return value.
 * @typedef IAthrokStoreListener
 * @type {() => void}
 */
export type IAthrokStoreListener<T> = (state: T) => void;

export type IAthrokStoreConfig<T> =
  // | { name?: string; persist?: IAthrokPersistConfig<T> }
  // | ({ persist: IAthrokPersistConfig<T>; name: string } | {});

  | { persist?: undefined; name?: string }
  | { persist: IAthrokPersistConfig<T>; name: string };
export interface IAthrokPersistConfig<T> {
  enable: boolean;
  /** Optional debounce time in milliseconds for reducing the frequency of state persistence (default is 200ms). */
  debounceTime?: number;
  /** Optional version number for migration. */
  version?: number;
  /**
   * Function to migrate the persisted state to the current state type.
   * @param persistedState The persisted state to migrate.
   * @param initialState The initial state.
   * @param version The version number for migration (if provided).
   * @returns The migrated state.
   */
  migrate?: (storedValue: ANY, version?: number) => ANY;
  /**
   * Function to create a partial state from the current state.
   * @param state The current state.
   * @returns The partial state.
   */
  partial?: (state: T) => Partial<T>;

  merge?: (initialValue: T, storedValue: ANY) => ANY;
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
 * @type {(setState: (update: ((currentState: T) => T) | T) => void, getState: () => T, store: AthrokStore<T, R>) => R}
 */
export type IAthrokStoreCallback<
  T extends Record<string, ANY> = Record<string, ANY>,
  R extends Record<string, ANY> = Record<string, ANY>,
> = (
  setState: (update: ((currentState: T) => T) | T) => void,
  getState: () => T,
  store: AthrokStore<T, R>
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

export type DevToolsFeatures = {
  pause?: boolean;
  lock?: boolean;
  persist?: boolean;
  export?: boolean;
  import?: string;
  jump?: boolean;
  skip?: boolean;
  reorder?: boolean;
  dispatch?: boolean;
};

export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;
