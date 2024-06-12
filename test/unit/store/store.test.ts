import { describe, vi } from "vitest";
import { AthrokMaster } from "../../../src/store/master";
import { AthrokStore, createStore } from "../../../src/store/store";

describe("AthrokStore", () => {
  it("should initialize with the given initial state", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);

    const store = new AthrokStore(initialState, callback);
    expect(store.get()).toEqual(initialState);
    expect(store["type"]).toBe("AthrokStore");
  });
  it("should initialize with the given initial state and config", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);
    const config = { name: "test", persist: { enable: true } };
    const store = new AthrokStore(initialState, callback, config);
    expect(store.get()).toEqual(initialState);
  });

  it("should inherit from AthrokMaster", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);

    const store = new AthrokStore(initialState, callback);
    expect(store instanceof AthrokMaster).toBe(true);
  });

  it("should generate actions using the provided callback function", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);
    const store = new AthrokStore(initialState, callback);
    expect(store.actions).toEqual(actions);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("createStore", () => {
  it("should create a new instance of AthrokStore with the given initial state", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);
    const config = { name: "test", persist: { enable: true } };
    const store = createStore(initialState, callback);
    expect(store.get()).toEqual(initialState);
    expect(store["type"]).toEqual("AthrokStore");
  });

  it("should create a new instance of AthrokStore with the given initial state and config", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);
    const config = { name: "test", persist: { enable: true } };
    const store = createStore(initialState, callback, config);
    expect(store.get()).toEqual(initialState);
  });

  it("should generate actions using the provided callback function", () => {
    const initialState = { key: "value" };
    const actions = {
      increment: vi.fn(),
      decrement: vi.fn(),
    };
    const callback = vi.fn().mockReturnValue(actions);
    const store = createStore(initialState, callback);
    expect(store.actions).toEqual(actions);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});
