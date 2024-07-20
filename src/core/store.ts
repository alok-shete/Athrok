import { useAStore } from "../hooks/useAStore";
import {
  ANY,
  IAthrokActionsCallback,
  IAthrokStoreConfig,
  IAthrokStoreHook,
} from "../utils/types";
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
    callback: IAthrokActionsCallback<T, R>,
    config?: IAthrokStoreConfig<T>
  ) {
    super(initialState, config);
    this.type = "AthrokStore";
    // Generate actions using the provided callback function
    this.actions = callback({
      get: this.get.bind(this),
      set: this.set.bind(this),
      subscribe: this.subscribe.bind(this),
    });
  }
}

/**
 * Creates a store hook with the provided initial state, callback, and configuration.
 *
 * This function initializes a new instance of AthrokStore with the specified initial state,
 * callback function to generate actions, and optional configuration for persistence. It returns
 * a store hook that integrates with React components and allows selecting specific parts of
 * state and actions using a selector function.
 *
 * @param initialState - The initial state of the store.
 * @param callback - Callback function to generate actions based on store methods.
 * @param config - Optional configuration for persistence.
 * @returns The created store hook.
 *
 * @template T - Type of the store's state.
 * @template R - Type of the store's actions.
 *
 * @example
 * ```typescript
 * // Define the state type for the store
 * interface AppState {
 *   count: number;
 * }
 *
 * // Define the actions type for the store
 * interface AppActions {
 *   increment: () => void;
 * }
 *
 * // Create a store hook using createStore
 * const useAppState = createStore<AppState, AppActions>(
 *   { count: 0 },
 *   ({set, get}) => ({
 *     increment: () => set((prevState) => ({ ...prevState, count: prevState.count + 1 })),
 *   }),
 *   { name: "AppState", persist: { enable: true } }
 * );
 *
 * // Example component using the created store hook
 * const ExampleComponent: React.FC = () => {
 *   // Destructure the state and actions from the hook
 *   const { count, increment } = useAppState();
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <button onClick={increment}>Increment Count</button>
 *     </div>
 *   );
 * };
 * ```
 */
export const createStore = <
  T extends Record<ANY, ANY>,
  R extends Record<ANY, ANY>,
>(
  initialState: T,
  callback: IAthrokActionsCallback<T, R>,
  config?: IAthrokStoreConfig<T>
): IAthrokStoreHook<T, R> => {
  const store = new AthrokStore(initialState, callback, config);
  const hook = (selector: <S>(state: T & R) => S) => useAStore(store, selector);
  hook.actions = store.actions;
  hook.subscribe = store.subscribe;
  hook.get = store.get;
  hook.set = store.set;
  return hook as IAthrokStoreHook<T, R>;
};
