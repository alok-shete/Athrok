import { vi } from "vitest";

vi.mock("../../src/storage/manager", () => ({
  StorageManager: {
    setPersistenceKey: vi.fn(),
    persistData: {},
    storage: {
      setItem: vi.fn(),
      getItem: vi.fn(),
    },
  },
}));
