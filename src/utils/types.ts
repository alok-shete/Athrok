/**
 * Represents any type.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ANY = any;

/**
 * Defines the signature of a listener function for Athrok state updates.
 * The listener function receives the updated state of type T as its only parameter
 * and does not return a value.
 *
 * @template T - The type of the state that the listener function receives.
 */
export type IAthrokStateListener<T> = (state: T) => void;

/**
 * Defines the configuration options for an Athrok store.
 * The configuration can either include persistence settings or omit them.
 *
 * @template T - The type of the state that the store will manage.
 */
export type IAthrokStoreConfig<T> =
  | {
      /**
       * Optional persistence configuration. If omitted, persistence is not enabled.
       */
      persist?: undefined;

      /**
       * Optional name of the store. Can be used for identification purposes.
       */
      name?: string;
    }
  | {
      /**
       * Persistence configuration. When provided, the store state will be persisted.
       */
      persist: IAthrokPersistConfig<T>;

      /**
       * Name of the store. Must be provided if persistence is enabled.
       */
      name: string;
    };

export interface IAthrokPersistConfig<T> {
  /**
   * Enables or disables state persistence.
   */
  enable: boolean;

  /**
   * Optional debounce time in milliseconds for reducing the frequency of state persistence.
   * Default is 100ms.
   */
  debounceTime?: number;

  /**
   * Optional version number for migration.
   */
  version?: number;

  /**
   * Function to migrate the persisted state to the current state type.
   * @param storedValue - The persisted state to migrate.
   * @param version - The version number for migration (if provided).
   * @returns The migrated state.
   */
  migrate?: (storedValue: any, version?: number) => any;

  /**
   * Function to create a partial state from the current state.
   * @param state - The current state.
   * @returns The partial state.
   */
  partial?: (state: T) => Partial<T>;

  /**
   * Function to merge the initial state and the persisted state.
   * @param initialValue - The initial state.
   * @param storedValue - The persisted state.
   * @returns The merged state.
   */
  merge?: (initialValue: T, storedValue: any) => T;
}

/**
 * Interface for synchronous storage operations.
 */
export interface IAthrokSyncStorage {
  /**
   * Retrieves all keys from the storage.
   */
  getKeys: () => string[];

  /**
   * Retrieves the value associated with the given key from the storage.
   */
  getItem: (name: string) => string | null;

  /**
   * Sets the value for the given key in the storage.
   */
  setItem: (name: string, value: string) => void;

  /**
   * Removes the value associated with the given key from the storage.
   */
  removeItem: (name: string) => void;
}

/**
 * Interface for asynchronous storage operations.
 */
export interface IAthrokAsyncStorage {
  /**
   * Retrieves all keys from the storage asynchronously.
   */
  getKeys: () => Promise<string[]> | Promise<readonly string[]>;

  /**
   * Retrieves the value associated with the given key from the storage asynchronously.
   */
  getItem: (name: string) => Promise<string | null>;

  /**
   * Sets the value for the given key in the storage asynchronously.
   */
  setItem: (name: string, value: string) => Promise<void>;

  /**
   * Removes the value associated with the given key from the storage asynchronously.
   */
  removeItem: (name: string) => Promise<void>;
}

export type IAthrokActionsCallbackStore<T> = {
  set: (update: ((currentState: T) => T) | T) => void;
  get: () => T;
  subscribe: (listener: IAthrokStateListener<T>) => () => void;
};

/**
 * Type definition for a callback function used in Athrok stores.
 *
 * @template T - The type of the state managed by the store, defaults to a record of any type.
 * @template R - The type of the returned value from the callback, defaults to a record of any type.
 */
export type IAthrokActionsCallback<
  T extends Record<string, any> = Record<string, any>,
  R extends Record<string, any> = Record<string, any>,
> = (store: IAthrokActionsCallbackStore<T>) => R;

/**
 * Defines the available features for development tools.
 */
export type DevToolsFeatures = {
  /**
   * Whether the pause feature is enabled.
   */
  pause?: boolean;

  /**
   * Whether the lock feature is enabled.
   */
  lock?: boolean;

  /**
   * Whether the persist feature is enabled.
   */
  persist?: boolean;

  /**
   * Whether the export feature is enabled.
   */
  export?: boolean;

  /**
   * A string representing the import feature. This can specify the format or the source of the import.
   */
  import?: string;

  /**
   * Whether the jump feature is enabled.
   */
  jump?: boolean;

  /**
   * Whether the skip feature is enabled.
   */
  skip?: boolean;

  /**
   * Whether the reorder feature is enabled.
   */
  reorder?: boolean;

  /**
   * Whether the dispatch feature is enabled.
   */
  dispatch?: boolean;
};

/**
 * Makes a subset of properties from type T required while leaving the rest optional.
 * @template T - The base type.
 * @template K - The keys of T to be made required.
 */
export type PartiallyRequired<T, K extends keyof T> = Omit<T, K> &
  Required<Pick<T, K>>;

/**
 * Defines a hook interface for managing state and actions in Athrok stores.
 * @template T - The type of the state managed by the store.
 * @template R - The type of actions available in the store.
 */

export type IAthrokStoreHook<T, R> = {
  /**
   * Hook function overload: returns a merged type of T & R.
   */
  <S = T & R>(): S;

  /**
   * Hook function overload: accepts a selector function and returns its selected result type.
   * @param selector - Selector function to derive a subset of state.
   * @returns The selected state derived by the selector function.
   */
  <S = T & R>(selector: (state: T & R) => S): S;

  /**
   * Returns the current state managed by the store.
   * @returns The current state.
   */
  get: () => T;
  /**
   * Provides access to the actions available in the store.
   */
  actions: R;
  /**
   * Subscribes a listener function to state changes in the store.
   * @param listener - Listener function to be called on state changes.
   * @returns A function to unsubscribe the listener.
   */
  subscribe(listener: IAthrokStateListener<T>): () => void;
  /**
   * Sets the state of the store using a React SetStateAction.
   * @param updateAction - Action to update the state.
   */
  set(updateAction: React.SetStateAction<T>): void;
};

/**
 * Defines a hook interface for managing state in Athrok.
 * @template T - The type of the state managed by the hook.
 */
export type IAthrokStateHook<T> = {
  /**
   * Hook function overload: returns a tuple containing state `S` and a dispatch function to update the state.
   */
  <S = T>(): [S, React.Dispatch<React.SetStateAction<T>>];
  /**
   * Returns the current state managed by the hook.
   * @returns The current state.
   */
  get: () => T;
  /**
   * Subscribes a listener function to state changes.
   * @param listener - Listener function to be called on state changes.
   * @returns A function to unsubscribe the listener.
   */
  subscribe(listener: IAthrokStateListener<T>): () => void;
  /**
   * Sets the state using a React SetStateAction.
   * @param updateAction - Action to update the state.
   */
  set(updateAction: React.SetStateAction<T>): void;
};

/**
 * Represents the props type after enhancing a component with state props using a state mapping function.
 * @template T Original props type of the component.
 * @template R State mapping function type that maps props to state props.
 */
export type IWithAthrokConnectProps<
  T extends Record<string, ANY>,
  R extends (props: ANY) => ANY,
> = Omit<T, keyof ReturnType<R>> & ReturnType<R>;
