/**
 * Athrok is a lightweight and flexible state management library for React applications,
 * providing both synchronous and asynchronous storage solutions with an intuitive API.
 * It offers efficient data persistence and seamless integration with various storage mechanisms.
 */

import { useAStore } from './hooks/useAStore';
import { useAState } from './hooks/useAState';
import {
  IAthrokStoreListener,
  IAthrokSetState,
  IAthrokPersistConfig,
  IAthrokStoreConfig,
  IAthrokGetState,
  IAthrokAsyncStorage,
  IAthrokSyncStorage,
} from './utils/types';

import { Store, createStore } from './store/store';
import { State, createState } from './store/state';
import {
  StorageManager,
  clearPersistence,
  getPersistanceKeys,
} from './store/storage';
import { deepMerge, shallowMerge } from './utils/functions';

/**
 * The Athrok library namespace, providing access to its features.
 */
const Athrok = {
  /**
   * Hook for accessing the store in functional components.
   */
  useAStore: useAStore,
  /**
   * Class representing the store for managing application state.
   */
  Store,
  /**
   * Utility class for managing storage-related operations.
   */
  StorageManager: StorageManager,
  /**
   * Function for creating a new instance of the store.
   */
  createStore: createStore,

  State,
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
  Store,
  createStore,
  StorageManager,
  State,
  createState,
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
