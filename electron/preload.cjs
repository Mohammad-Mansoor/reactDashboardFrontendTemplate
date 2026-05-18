/**
 * App Preload — Secure IPC bridge between renderer and main.
 * Only whitelisted channels are allowed to send or receive.
 */
const { contextBridge, ipcRenderer } = require("electron");

// ─── Channel Whitelists ─────────────────────────────────────────────────────
const VALID_SEND_CHANNELS = [
  "window-minimize",
  "window-maximize",
  "window-close",
];

const VALID_RECEIVE_CHANNELS = [
  "loading-progress",
  "update-available",
  "update-downloaded",
  "window-maximized-state",
];

// ─── Exposed API ─────────────────────────────────────────────────────────────
contextBridge.exposeInMainWorld("electronAPI", {
  /**
   * Send an IPC message to the main process.
   * Only whitelisted channels are forwarded.
   */
  send: (channel, data) => {
    if (!VALID_SEND_CHANNELS.includes(channel)) {
      console.warn(`[preload] Blocked send on unknown channel: "${channel}"`);
      return;
    }
    ipcRenderer.send(channel, data);
  },

  /**
   * Listen for an IPC event from the main process.
   * Only whitelisted channels are subscribed to.
   * Returns a cleanup function — call it to remove the listener and avoid memory leaks.
   */
  on: (channel, callback) => {
    if (!VALID_RECEIVE_CHANNELS.includes(channel)) {
      console.warn(`[preload] Blocked receive on unknown channel: "${channel}"`);
      return () => {};
    }
    const handler = (_, data) => callback(data);
    ipcRenderer.on(channel, handler);
    // Return cleanup function so React components can call it on unmount
    return () => ipcRenderer.removeListener(channel, handler);
  },

  /**
   * Listen for an IPC event exactly once.
   */
  once: (channel, callback) => {
    if (!VALID_RECEIVE_CHANNELS.includes(channel)) {
      console.warn(`[preload] Blocked once on unknown channel: "${channel}"`);
      return;
    }
    ipcRenderer.once(channel, (_, data) => callback(data));
  },
});