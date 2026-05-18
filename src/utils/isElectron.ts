/**
 * Detects whether the React app is running inside Electron.
 *
 * Detection strategy (two-layer):
 * 1. Build-time: VITE_IS_ELECTRON=true is injected by all electron npm scripts.
 * 2. Runtime fallback: window.electronAPI is present when the preload has run.
 *
 * This means it works correctly in:
 *  - `yarn dev`          → false (web browser)
 *  - `yarn build`        → false (web production)
 *  - `yarn dev:electron` → true  (Electron dev)
 *  - `yarn dist:win`     → true  (packaged Electron)
 */
export const isElectron = (): boolean => {
  // Build-time flag (most reliable)
  if (import.meta.env.VITE_IS_ELECTRON === "true") return true;
  // Runtime fallback — preload exposes this object
  if (typeof window !== "undefined" && !!window.electronAPI) return true;
  return false;
};
