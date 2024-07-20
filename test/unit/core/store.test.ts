import { describe, it, vi } from "vitest";
import { AthrokMaster } from "../../../src/core/master";
import { AthrokStore, createStore } from "../../../src/core/store";
import { renderHook, act } from "@testing-library/react";

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
    const store = createStore(initialState, callback);
    expect(store.get()).toEqual(initialState);
    expect(typeof store).toBe("function");
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

  it("should create a hook with actions and state", () => {
    const useStore = createStore({ count: 0 }, ({ set, get }) => ({
      increment: () => set({ count: get().count + 1 }),
      decrement: () => set({ count: get().count - 1 }),
    }));

    const { result } = renderHook(() => useStore());

    expect(result.current.count).toBe(0);
    act(() => {
      result.current.increment();
    });
    expect(result.current.count).toBe(1);
    act(() => {
      result.current.decrement();
    });
    expect(result.current.count).toBe(0);
  });

  it("should correctly update state with action", () => {
    const initialState = { message: "Hello" };
    const useStore = createStore(initialState, ({ set }) => ({
      setMessage: (newMessage) => set({ message: newMessage }),
    }));

    expect(useStore.get().message).toBe("Hello");
    useStore.actions.setMessage("Hola");
    expect(useStore.get().message).toBe("Hola");
  });

  it("should trigger subscriptions on state change", () => {
    const initialState = { count: 0 };
    const useStore = createStore(initialState, ({ set }) => ({
      increment: () => set((pre) => ({ count: pre.count + 1 })),
    }));

    let currentState = useStore.get();
    const unsubscribe = useStore.subscribe((state) => {
      currentState = state;
    });

    useStore.actions.increment();
    expect(currentState).toEqual({ count: 1 });
    expect(useStore.get()).toEqual({ count: 1 });
    unsubscribe();
    useStore.actions.increment();
    expect(useStore.get()).toEqual({ count: 2 });
    expect(currentState).toEqual({ count: 1 });
  });

  it("should handle async actions correctly", async () => {
    const initialState = { count: 0 };
    const useStore = createStore(initialState, ({ set }) => ({
      incrementAsync: async () => {
        await new Promise((resolve) => setTimeout(resolve));
        set((pre) => ({ count: pre.count + 1 }));
      },
    }));

    await useStore.actions.incrementAsync();
    expect(useStore.get().count).toBe(1);
  });
});
