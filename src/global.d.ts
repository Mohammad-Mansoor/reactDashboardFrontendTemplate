export {};

declare global {
  interface Window {
    /** Full app IPC bridge — available only in Electron renderer */
    electronAPI: {
      /** Send a whitelisted IPC message to main process */
      send: (channel: string, data?: unknown) => void;
      /**
       * Subscribe to a whitelisted IPC event from main process.
       * Returns a cleanup function — call it to remove the listener (prevents memory leaks).
       */
      on: (channel: string, callback: (data: unknown) => void) => () => void;
      /** Subscribe to a whitelisted IPC event exactly once */
      once: (channel: string, callback: (data: unknown) => void) => void;
    };
    /** Minimal splash-only IPC bridge — only available in the splash HTML renderer */
    splashAPI: {
      on: (channel: string, callback: (data: unknown) => void) => () => void;
    };
  }
}