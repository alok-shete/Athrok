import { IAthrokStoreConfig } from '../utils/types';
import { Master } from './master';

export class State<T> extends Master<T> {
  /**
   * Constructs a new instance of the Store.
   * @param initialState - The initial state of the store.
   * @param config - Optional configuration for persistence.
   */
  constructor(initialState: T, config?: IAthrokStoreConfig<T>) {
    super(initialState, config);
  }
}

/**
 * Creates a new instance of a store with the provided initial state, callback, and configuration.
 *
 * This function creates a new instance of a store with the specified initial state, callback function
 * to generate actions, and optional configuration for persistence. It returns the created store instance.
 *
 * @param initialState - The initial state of the store.
 * @param callback - Callback function to generate actions based on store methods.
 * @param config - Optional configuration for persistence.
 * @returns The created store instance.
 *
 * @template T - Type of the store's state.
 * @template R - Type of the store's actions.
 *
 * @example
 * ```typescript
 * // Define initial state for the store
 * interface CounterState {
 *   count: number;
 * }
 *
 * // Define actions for the store
 * interface CounterActions {
 *   increment: () => void;
 *   decrement: () => void;
 * }
 *
 * // Create a new instance of the store with initial state and actions
 * const counterStore = createStore<CounterState, CounterActions>(
 *   { count: 0 }, // Initial state
 *   (setState, getState) => ({ // Callback function to generate actions
 *     increment: () => setState({ count: getState().count + 1 }), // Action to increment count
 *     decrement: () => setState({ count: getState().count - 1 }), // Action to decrement count
 *   }),
 *   { persist: { name: 'counter' } } // Optional persistence configuration
 * );
 * ```
 */

export const createState = <T>(
  initialState: T,
  config?: IAthrokStoreConfig<T>
): State<T> => {
  const state = new State(initialState, config);

  return state;
};
