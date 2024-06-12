import { useState, useEffect } from "react";
import { AthrokStore } from "../store/store";
import { ANY } from "../utils/types";

/**
 * Custom hook for integrating a store with React components.
 *
 * This hook allows React components to subscribe to a store and automatically update
 * when the store state changes. It also provides support for selecting specific parts
 * of the store state and actions using a selector function.
 *
 * @param store - The store instance to integrate with the component.
 * @param selector - Optional selector function to derive a subset of state and actions.
 * @returns The selected state or the entire store state and actions based on the provided selector.
 *
 * @template T - Type of the store's state.
 * @template R - Type of the store's actions.
 * @template S - Type of the selected state.
 *
 * @example
 * ```tsx
 * // Using the hook with a store instance
 * const Component = () => {
 *   const selectedState = useAStore(store);
 *   // Use selectedState in the component
 * };
 * ```
 */
export const useAStore = <
  T extends Record<ANY, ANY> = Record<ANY, ANY>,
  R extends Record<ANY, ANY> = Record<ANY, ANY>,
  S = T & R,
>(
  store: AthrokStore<T, R>,
  selector: (state: T & R) => S = (state) => state
): S => {
  const [selectedState, setSelectedState] = useState<S>(() =>
    getStateWithSelector(store.get())
  );

  useEffect(() => {
    // Subscribe to store updates and update selected state accordingly
    const unsubscribe = store.subscribe((state) =>
      setSelectedState(getStateWithSelector(state))
    );

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [store, selector]);

  /**
   * Gets the selected state or the entire store state and actions based on the provided selector.
   *
   * If a selector function is provided, it is used to derive a subset of state and actions.
   * Otherwise, the entire store state and actions are returned.
   *
   * @returns {T & R | S | undefined} - Selected state, entire store state, or undefined if no selector is provided.
   */
  function getStateWithSelector(state: T) {
    return selector({ ...state, ...store.actions });
  }

  return selectedState;
};
