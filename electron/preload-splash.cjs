/**
 * Splash Window Preload — Minimal IPC surface.
 * Only exposes what the splash screen actually needs:
 * receiving the "loading-progress" event from main.
 */
const { contextBridge, ipcRenderer } = require("electron");

const VALID_RECEIVE_CHANNELS = ["loading-progress"];

contextBridge.exposeInMainWorld("splashAPI", {
  /**
   * Listen for a whitelisted IPC event from main.
   * Returns a cleanup function to remove the listener.
   */
  on: (channel, callback) => {
    if (!VALID_RECEIVE_CHANNELS.includes(channel)) {
      console.warn(`[splash-preload] Blocked receive on unknown channel: "${channel}"`);
      return () => {};
    }
    const handler = (_, data) => callback(data);
    ipcRenderer.on(channel, handler);
    // Return cleanup so callers can remove the listener
    return () => ipcRenderer.removeListener(channel, handler);
  },
});
