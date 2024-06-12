/**
 * Athrok is a lightweight and flexible state management library for React applications,
 * providing both synchronous and asynchronous storage solutions with an intuitive API.
 * It offers efficient data persistence and seamless integration with various storage mechanisms.
 */

import { useAStore } from "./hooks/useAStore";
import { useAState } from "./hooks/useAState";

import { AthrokStore, createStore } from "./store/store";
import { AthrokState, createState } from "./store/state";
import {
  StorageManager,
  clearPersistence,
  getPersistanceKeys,
} from "./storage/manager";
import { deepMerge, shallowMerge } from "./utils/functions";

import {
  IAthrokStoreListener,
  IAthrokSetState,
  IAthrokPersistConfig,
  IAthrokStoreConfig,
  IAthrokGetState,
  IAthrokAsyncStorage,
  IAthrokSyncStorage,
} from "./utils/types";

/**
 * The Athrok library namespace, providing access to its features.
 */
const Athrok = {
  /**
   * Hook for accessing the store in functional components.
   */
  useAStore: useAStore,
  useAState,
  /**
   * Class representing the store for managing application state.
   */
  AthrokStore,
  /**
   * Utility class for managing storage-related operations.
   */
  StorageManager: StorageManager,
  /**
   * Function for creating a new instance of the store.
   */
  createStore: createStore,

  AthrokState,
  createState,
  shallowMerge,
  deepMerge,
  clearPersistence,
  getPersistanceKeys,
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
};

// Export types for external use
export type {
  IAthrokStoreListener,
  IAthrokSetState,
  IAthrokGetState,
  IAthrokPersistConfig,
  IAthrokStoreConfig,
  IAthrokAsyncStorage,
  IAthrokSyncStorage,
};

export default Athrok;
