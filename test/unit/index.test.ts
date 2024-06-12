import Athrok from "./../../src";
import { useAStore } from "../../src/hooks/useAStore";
import { useAState } from "../../src/hooks/useAState";

import { AthrokStore, createStore } from "../../src/store/store";
import { AthrokState, createState } from "../../src/store/state";
import {
  StorageManager,
  clearPersistence,
  getPersistanceKeys,
} from "../../src/storage/manager";
import { deepMerge, shallowMerge } from "../../src/utils/functions";

describe("Athrok", () => {
  it("Check import", () => {
    expect(Athrok).toEqual({
      useAStore,
      useAState,
      createStore,
      createState,
      StorageManager,
      AthrokState,
      AthrokStore,
      shallowMerge,
      deepMerge,
      clearPersistence,
      getPersistanceKeys,
    });

    // const Athrok = {
    //     /**
    //      * Hook for accessing the store in functional components.
    //      */
    //     useAStore: useAStore,
    //     /**
    //      * Class representing the store for managing application state.
    //      */
    //     AthrokStore,
    //     /**
    //      * Utility class for managing storage-related operations.
    //      */
    //     StorageManager: StorageManager,
    //     /**
    //      * Function for creating a new instance of the store.
    //      */
    //     createStore: createStore,

    //     AthrokState,
    //     createState,
    //     shallowMerge,
    //     deepMerge,
    //     clearPersistence,
    //     getPersistanceKeys,
    //   };

    // Export individual components for ease of use
    //   export {
    // useAStore,
    // useAState,
    // createStore,
    // createState,
    // StorageManager,
    // AthrokState,
    // AthrokStore,
    // shallowMerge,
    // deepMerge,
    // clearPersistence,
    // getPersistanceKeys,
    //   };
  });
});
