import { useAState } from "../hooks/useAState";
import { IAthrokStateHook, IAthrokStoreConfig } from "../utils/types";
import { AthrokMaster } from "./master";

/**
 * Represents a state management class extending AthrokMaster.
 *
 * This class inherits methods for updating state, subscribing to state changes,
 * and optionally persisting state data to storage with debounce functionality.
 *
 * @template T - Type of the state managed by AthrokState.
 */
export class AthrokState<T> extends AthrokMaster<T> {
  /**
   * Constructs an instance of AthrokState.
   *
   * @param initialState - The initial state managed by AthrokState.
   * @param config - Optional configuration for persistence and other settings.
   */
  constructor(initialState: T, config?: IAthrokStoreConfig<T>) {
    super(initialState, config);
    this.type = "AthrokState";
  }
}
/**
 * Creates a state hook with the provided initial state and optional persistence configuration.
 *
 * This function initializes a state hook with the specified initial state and optional
 * persistence configuration. It returns the state hook, which allows components to subscribe
 * to state updates and manage state actions.
 *
 * @param initialState - The initial state of the store.
 * @param config - Optional configuration for persistence.
 * @returns The created state hook.
 *
 * @template T - Type of the store's state.
 *
 * @example
 * ```typescript
 * // Define the initial state type
 * interface AppState {
 *   count: number;
 *   text: string;
 * }
 *
 * // Create a state hook using createState
 * const useAppState: IAthrokStateHook<AppState> = createState({
 *   count: 0,
 *   text: "Initial Text",
 * });
 *
 * // Example component using the created state hook
 * const ExampleComponent: React.FC = () => {
 *   // Destructure the state and setter function from the hook
 *   const [{ count, text }, setState] = useAppState();
 *
 *   // Example handler to update state
 *   const incrementCount = () => {
 *     setState((prevState) => ({
 *       ...prevState,
 *       count: prevState.count + 1,
 *     }));
 *   };
 *
 *   return (
 *     <div>
 *       <p>Count: {count}</p>
 *       <p>Text: {text}</p>
 *       <button onClick={incrementCount}>Increment Count</button>
 *     </div>
 *   );
 * };
 * ```
 */

export const createState = <T>(
  initialState: T,
  config?: IAthrokStoreConfig<T>
): IAthrokStateHook<T> => {
  const state = new AthrokState(initialState, config);
  const hook = () => useAState(state);
  hook.subscribe = state.subscribe;
  hook.get = state.get;
  hook.set = state.set;
  return hook as IAthrokStateHook<T>;
};
