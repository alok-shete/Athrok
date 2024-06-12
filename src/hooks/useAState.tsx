import { useState, useEffect } from "react";
import { AthrokState } from "../store/state";

export const useAState = <T,>(
  state: AthrokState<T>
): [T, React.Dispatch<React.SetStateAction<T>>] => {
  const [selectedState, setSelectedState] = useState<T>(state.get());

  useEffect(() => {
    // Subscribe to store updates and update selected state accordingly
    const unsubscribe = state.subscribe(setSelectedState);

    // Clean up subscription on unmount
    return () => unsubscribe();
  }, [state]);

  return [selectedState, state.set];
};
