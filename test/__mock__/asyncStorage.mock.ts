import { vi } from "vitest";
import { IAthrokAsyncStorage } from "../../src/utils/types";

const getItemMock = vi.fn();
const setItemMock = vi.fn();
const removeItemMock = vi.fn();
const getKeysMock = vi.fn();

const mockAsyncStorage: IAthrokAsyncStorage = {
  getItem: async (...rest) => {
    const response = (await getItemMock(...rest)) as unknown as string;
    return response;
  },
  setItem: async (...rest) => {
    await setItemMock(...rest);
  },
  removeItem: async (...rest) => {
    await removeItemMock(...rest);
  },
  getKeys: async (...rest) => {
    const response = (await getKeysMock(...rest)) as unknown as string[];
    return response;
  },
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
