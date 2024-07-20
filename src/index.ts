import { useAStore } from "./hooks/useAStore";
import { useAState } from "./hooks/useAState";
import { AthrokStore, createStore } from "./core/store";
import { AthrokState, createState } from "./core/state";
import { withAthrokConnect } from "./hoc/withAthrokConnect";
import {
  StorageManager,
  clearPersistence,
  getPersistanceKeys,
} from "./storage/manager";
import { deepMerge, shallowMerge } from "./utils/functions";
import {
  IAthrokStateListener,
  IAthrokPersistConfig,
  IAthrokStoreConfig,
  IAthrokAsyncStorage,
  IAthrokSyncStorage,
  IWithAthrokConnectProps,
  IAthrokActionsCallback,
  IAthrokActionsCallbackStore,
  IAthrokStateHook,
  IAthrokStoreHook,
} from "./utils/types";

/**
 * The Athrok library namespace, providing access to its features.
 */
const Athrok = {
  /**
   * Hook for accessing the store in functional components.
   */
  useAStore,

  /**
   * Hook for accessing state in functional components.
   */
  useAState,

  /**
   * Class representing the store for managing application state.
   */
  AthrokStore,

  /**
   * Class representing the state for managing application state without actions.
   */
  AthrokState,

  /**
   * Function for creating a new instance of the store.
   */
  createStore,

  /**
   * Function for creating a new instance of the state without actions.
   */
  createState,

  /**
   * Utility class for managing storage-related operations.
   */
  StorageManager,

  /**
   * Function for merging objects deeply.
   */
  deepMerge,

  /**
   * Function for merging objects shallowly.
   */
  shallowMerge,

  /**
   * Function for clearing persistence storage.
   */
  clearPersistence,

  /**
   * Function for retrieving persistence keys.
   */
  getPersistanceKeys,

  /**
   * Function for state props using a state mapping.
   */
  withAthrokConnect,
};

// Export individual components for ease of use
export {
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
  withAthrokConnect,
};

// Export types for external use
export type {
  IAthrokStateListener,
  IAthrokPersistConfig,
  IAthrokStoreConfig,
  IAthrokAsyncStorage,
  IAthrokSyncStorage,
  IWithAthrokConnectProps,
  IAthrokActionsCallback,
  IAthrokActionsCallbackStore,
  IAthrokStateHook,
  IAthrokStoreHook,
};

export default Athrok;
