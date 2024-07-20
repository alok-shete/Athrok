import Athrok, { withAthrokConnect } from "./../../src";
import { useAStore } from "../../src/hooks/useAStore";
import { useAState } from "../../src/hooks/useAState";

import { AthrokStore, createStore } from "../../src/core/store";
import { AthrokState, createState } from "../../src/core/state";
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
      withAthrokConnect,
    });
  });
});
