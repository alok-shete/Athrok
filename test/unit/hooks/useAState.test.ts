import { beforeEach, describe, it } from "vitest";
import { renderHook, act } from "@testing-library/react-hooks";
import masterMock from "../../__mock__/master.mock";
import { useAState } from "../../../src/hooks/useAState";

describe("useAState hook", () => {
  beforeEach(() => {
    masterMock.restoreAllMocks();
  });

  it("should initialize with the value from state.get()", () => {
    const stateValue = 10;
    const mockState = masterMock.createState(stateValue);
    const { result } = renderHook(() => useAState(mockState));
    expect(result.current[0]).toBe(stateValue);
  });

  it("should update the state when state.subscribe triggers", () => {
    const oldValue = "old value";
    const newValue = "new value";
    const mockState = masterMock.createState(oldValue);

    const { result } = renderHook(() => useAState(mockState));

    act(() => {
      masterMock.subscribeCallback(newValue);
    });
    expect(result.current[0]).toBe(newValue);
  });

  it("should unsubscribe on unmount", () => {
    const mockState = masterMock.createState(10);
    const { unmount } = renderHook(() => useAState(mockState));
    unmount();
    expect(masterMock.unsubscribeMock).toHaveBeenCalledTimes(1);
  });

  it("should return the state.set method", () => {
    const mockState = masterMock.createState(10);
    const { result } = renderHook(() => useAState(mockState));
    expect(result.current[1]).toBe(mockState.set);
  });

  it("should handle initial state of different types", () => {
    const initialStates = [42, "string", { key: "value" }, [1, 2, 3], true];

    initialStates.forEach((initialState) => {
      const mockState = masterMock.createState(initialState);
      const { result } = renderHook(() => useAState(mockState));
      expect(result.current[0]).toBe(initialState);
    });
  });

  it("should allow calling state.set to update the state", () => {
    const mockState = masterMock.createState("old value");
    const { result } = renderHook(() => useAState(mockState));

    act(() => {
      result.current[1]("updated value");
      masterMock.subscribeCallback("updated value");
    });

    expect(mockState.set).toHaveBeenCalledWith("updated value");
    expect(result.current[0]).toBe("updated value");
  });
});
