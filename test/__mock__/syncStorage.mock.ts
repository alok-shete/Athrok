import { vi } from "vitest";
import { IAthrokAsyncStorage } from "../../src/utils/types";

const getItemMock = vi.fn();
const setItemMock = vi.fn();
const removeItemMock = vi.fn();
const getKeysMock = vi.fn();

const mockAsyncStorage: IAthrokAsyncStorage = {
  getItem: getItemMock,
  setItem: setItemMock,
  removeItem: removeItemMock,
  getKeys: getKeysMock,
};
const restoreAllMock = () => {
  [getItemMock, setItemMock, removeItemMock, getKeysMock].forEach((mock) =>
    mock.mockRestore()
  );
};

export default {
  restoreAllMock,
  getItemMock,
  setItemMock,
  removeItemMock,
  getKeysMock,
  create: () => mockAsyncStorage,
};
