import { describe, it } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { AthrokMaster } from "../../../src/core/master";
import { createState, AthrokState } from "../../../src/core/state";

describe("AthrokState", () => {
  it("should initialize with the given initial state", () => {
    const initialState = { key: "value" };
    const state = new AthrokState(initialState);
    expect(state.get()).toEqual(initialState);
    expect(state["type"]).toBe("AthrokState");
  });

  it("should initialize with the given initial state and config", () => {
    const initialState = { key: "value" };
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
    expect(typeof state).toBe("function");
  });

  it("should create a hook with actions and state", () => {
    const useCountState = createState({ count: 0 });

    const { result } = renderHook(() => useCountState());

    expect(result.current[0]).toEqual({
      count: 0,
    });
    act(() => {
      const setFun = result.current[1];
      setFun((pre) => ({ count: pre.count + 1 }));
    });
    expect(result.current[0]).toEqual({ count: 1 });
    act(() => {
      const setFun = result.current[1];
      setFun((pre) => ({ count: pre.count - 1 }));
    });
    expect(result.current[0]).toEqual({ count: 0 });
  });

  it("should correctly update state with action", () => {
    const initialState = { message: "Hello" };
    const useStore = createState(initialState);

    expect(useStore.get().message).toBe("Hello");
    useStore.set({ message: "Hola" });
    expect(useStore.get().message).toBe("Hola");
  });

  it("should trigger subscriptions on state change", () => {
    const initialState = { count: 0 };
    const useStore = createState(initialState);

    let currentState = useStore.get();
    const unsubscribe = useStore.subscribe((state) => {
      currentState = state;
    });

    useStore.set((pre) => ({ count: pre.count + 1 }));
    expect(currentState).toEqual({ count: 1 });
    expect(useStore.get()).toEqual({ count: 1 });
    unsubscribe();
    useStore.set((pre) => ({ count: pre.count + 1 }));
    expect(useStore.get()).toEqual({ count: 2 });
    expect(currentState).toEqual({ count: 1 });
  });
});
