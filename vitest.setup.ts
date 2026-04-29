import { vi } from 'vitest';

// electron-store のモック
vi.mock('electron-store', () => {
  return {
    default: class {
      store: Record<string, unknown>;
      constructor(options: { defaults?: Record<string, unknown> } = {}) {
        this.store = options.defaults || {};
      }
      get(key: string): unknown {
        return this.store[key];
      }
      set(key: string, value: unknown): void {
        this.store[key] = value;
      }
      onDidChange(_: string, __: (newValue: unknown, oldValue: unknown) => void): () => void {
        return () => {};
      }
      onDidAnyChange(_: (newValue: unknown, oldValue: unknown) => void): () => void {
        return () => {};
      }
      clear(): void {
        this.store = {};
      }
    }
  };
});

// electron のモック
vi.mock('electron', () => {
  return {
    app: {
      getPath: vi.fn().mockReturnValue('/tmp'),
      getAppPath: vi.fn().mockReturnValue('/tmp'),
      on: vi.fn(),
      isPackaged: false
    },
    ipcMain: {
      on: vi.fn(),
      handle: vi.fn()
    },
    ipcRenderer: {
      on: vi.fn(),
      send: vi.fn(),
      invoke: vi.fn()
    },
    dialog: {
      showOpenDialog: vi.fn(),
      showMessageBox: vi.fn(),
      showErrorBox: vi.fn()
    },
    shell: {
      openPath: vi.fn(),
      showItemInFolder: vi.fn()
    },
    Menu: {
      buildFromTemplate: vi.fn().mockReturnValue({
        popup: vi.fn()
      })
    },
    nativeImage: {
      createFromPath: vi.fn().mockReturnValue({
        toDataURL: vi.fn().mockReturnValue('data:image/png;base64,')
      })
    },
    net: {
      fetch: vi.fn()
    }
  };
});

// electron-log のモック
vi.mock('electron-log/main', () => {
  const mockLog = {
    initialize: vi.fn(),
    errorHandler: {
      startCatching: vi.fn()
    },
    transports: {
      file: {
        level: 'info'
      },
      console: {
        level: 'info'
      }
    },
    debug: vi.fn(),
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn()
  };
  return {
    default: mockLog,
    ...mockLog
  };
});
