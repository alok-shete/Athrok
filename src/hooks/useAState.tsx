import { useState, useEffect } from "react";
import { AthrokState } from "../core/state";
import { ANY, IAthrokStateHook, IAthrokStoreHook } from "../utils/types";

/**
 * Custom React hook for managing state updates and subscriptions.
 * @param state - State object or hook implementing state management interface.
 * @returns A tuple containing the selected state and a setter function.
 *
 * @template T - Type of the state managed by AthrokState, IAthrokStateHook, or IAthrokStoreHook.
 *
 *   @example
 * ```tsx
 * // Using the hook with a store instance
 * const Component = () => {
 *   const [selectedState, setState] = useAState(state);
 *   // Use selectedState and setState in the component
 * };
 * ```
 */
export const useAState = <T,>(
  state: AthrokState<T> | IAthrokStateHook<T> | IAthrokStoreHook<T, ANY>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [selectedState, setSelectedState] = useState<T>(() => state.get());

  useEffect(() => {
    const unsubscribe = state.subscribe(setSelectedState);
    return () => unsubscribe();
  }, [state]);

  return [selectedState, state.set];
};
