import { beforeEach, describe, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import masterMock from "../../__mock__/master.mock";
import { useAStore } from "../../../src/hooks/useAStore";

describe("useAStore hook", () => {
  beforeEach(() => {
    masterMock.restoreAllMocks();
  });

  it("should initialize with the value from store.get() without a selector", () => {
    const stateValue = { count: 0 };
    const actions = { incrementCount: vi.fn() };
    const mockStore = masterMock.createStore(stateValue, actions);

    const { result } = renderHook(() => useAStore(mockStore));
    expect(result.current).toEqual({ ...stateValue, ...actions });
  });

  it("should initialize with the selected value from store.get() with a selector", () => {
    const stateValue = { count: 0 };
    const actions = { incrementCount: vi.fn() };
    const mockStore = masterMock.createStore(stateValue, actions);

    const selector = vi.fn((state) => state.count);

    const { result } = renderHook(() => useAStore(mockStore, selector));
    expect(result.current).toBe(stateValue.count);
    expect(selector).toHaveBeenCalledWith({
      ...stateValue,
      ...mockStore.actions,
    });
  });

  it("should update the state when store.subscribe triggers", () => {
    const stateValue = { count: 0 };
    const newStateValue = { count: 1 };
    const actions = { incrementCount: vi.fn() };
    const mockStore = masterMock.createStore(stateValue, actions);

    const { result } = renderHook(() => useAStore(mockStore));
    act(() => {
      masterMock.subscribeCallback(newStateValue);
    });

    expect(result.current).toEqual({ ...newStateValue, ...mockStore.actions });
  });

  it("should unsubscribe on unmount", () => {
    const stateValue = { count: 0 };
    const actions = { incrementCount: vi.fn() };
    const mockStore = masterMock.createStore(stateValue, actions);
    const { unmount } = renderHook(() => useAStore(mockStore));
    unmount();
    expect(masterMock.unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("should update the selected state when store.subscribe triggers with a selector", () => {
    const stateValue = { count: 0 };
    const newStateValue = { count: 1 };
    const actions = { incrementCount: vi.fn() };
    const mockStore = masterMock.createStore(stateValue, actions);

    const selector = vi.fn((state) => state.count);

    const { result } = renderHook(() => useAStore(mockStore, selector));
    expect(result.current).toBe(stateValue.count);
    expect(selector).toHaveBeenCalledWith({
      ...stateValue,
      ...mockStore.actions,
    });

    masterMock.subscribeCallback({ count: 1 });
    expect(result.current).toBe(newStateValue.count);
  });

  it("should handle complex selectors correctly", () => {
    const stateValue = { count: 0 };
    const actions = { incrementCount: vi.fn() };
    const mockStore = masterMock.createStore(stateValue, actions);

    const complexSelector = vi.fn((state) => ({ selectedCount: state.count }));

    const { result } = renderHook(() => useAStore(mockStore, complexSelector));
    expect(result.current).toEqual({
      selectedCount: stateValue.count,
    });
    expect(complexSelector).toHaveBeenCalledWith({
      ...stateValue,
      ...mockStore.actions,
    });
  });
});
