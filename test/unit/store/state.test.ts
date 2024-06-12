import { AthrokMaster } from "../../../src/store/master";
import { createState, AthrokState } from "../../../src/store/state";

describe("AthrokState", () => {
  it("should initialize with the given initial state", () => {
    const initialState = { key: "value" };
    const state = new AthrokState(initialState);
    expect(state.get()).toEqual(initialState);
    expect(state["type"]).toBe("AthrokState");
  });

  it("should initialize with the given initial state and config", () => {
    const initialState = { key: "value" };
    const config = { persist: { name: "test" } };
    const state = new AthrokState(initialState, {
      name: "test",
      persist: {
        enable: true,
      },
    });
    expect(state.get()).toEqual(initialState);
  });

  it("should inherit from AthrokMaster", () => {
    const initialState = { key: "value" };
    const state = new AthrokState(initialState);
    expect(state instanceof AthrokMaster).toBe(true);
  });
});

describe("createState", () => {
  it("should create a new instance of AthrokState with the given initial state", () => {
    const initialState = { key: "value" };
    const state = createState(initialState);
    expect(state.get()).toEqual(initialState);
    expect(state["type"]).toBe("AthrokState");
    expect(state instanceof AthrokState).toBe(true);
    expect(state instanceof AthrokMaster).toBe(true);
  });
});
