import { vi } from "vitest";
import { AthrokStore } from "../../src/store/store";
import { AthrokState } from "../../src/store/state";
import { ANY } from "../../src/utils/types";

const getMock = vi.fn();
const setMock = vi.fn();
const subscribeCallback = vi.fn();
const unsubscribeMock = vi.fn();
const actionsMock = vi.fn();

class MasterMock<T, S> {
  constructor(initValue: T, actions?: S) {
    getMock.mockReturnValue(initValue);
    actionsMock.mockReturnValue(actions);
  }
  get get() {
    return getMock;
  }

  get set() {
    return setMock;
  }

  get actions() {
    return actionsMock();
  }

  subscribe(callback) {
    subscribeCallback.mockImplementation(callback);
    return unsubscribeMock;
  }
}

const restoreAllMocks = () => {
  [getMock, setMock, subscribeCallback, unsubscribeMock].forEach((mock) =>
    mock.mockRestore()
  );
};

export default {
  createState<T>(initValue: T) {
    return new MasterMock(initValue) as unknown as AthrokState<T>;
  },

  createStore<
    T extends Record<ANY, ANY> = Record<ANY, ANY>,
    R extends Record<ANY, ANY> = Record<ANY, ANY>,
  >(initValue: T, actions?: R) {
    return new MasterMock(initValue, actions) as unknown as AthrokStore<T, R>;
  },
  restoreAllMocks,
  getMock,
  setMock,
  subscribeCallback,
  unsubscribeMock,
};
