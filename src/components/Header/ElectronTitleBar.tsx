import { useEffect, useState } from "react";
import WindowControls from "./desktopControlBar";

/**
 * ElectronTitleBar — The slim drag-region header that sits at the very top
 * of every screen when running as an Electron desktop app.
 *
 * Import and render this at the root of any layout (AppLayout, AuthLayout, etc.)
 * so window controls are always accessible — including on the login screen.
 *
 * In web/browser mode this component returns null, so it takes zero space.
 */
const ElectronTitleBar = () => {
  const [appVersion, setAppVersion] = useState("2.0.2");

  useEffect(() => {
    try {
      const v = (import.meta as { env: Record<string, string> }).env.VITE_APP_VERSION;
      if (v) setAppVersion(v);
    } catch {
      /* ignore */
    }
  }, []);

  return (
    <div
      id="electron-title-bar"
      className="
        drag
        flex items-center justify-between
        h-10 px-3 shrink-0
        bg-white dark:bg-gray-900
        border-b border-gray-100 dark:border-white/5
        select-none z-[9999]
      "
    >
      {/* ── Left: Brand + version ───────────────────────────────────────────── */}
      <div className="no-drag flex items-center gap-2.5 pointer-events-none">
        {/* Logo mark */}
        <div
          aria-hidden="true"
          className="
            flex h-6 w-6 items-center justify-center rounded-md shrink-0
            bg-gradient-to-br from-orange-500 to-blue-light-500 shadow-sm
          "
        >
          <span className="text-[10px] font-black text-white leading-none tracking-wider">
            HC
          </span>
        </div>

        {/* App name */}
        <span className="text-[13px] font-semibold text-gray-800 dark:text-gray-100 tracking-tight">
          HCMS
        </span>

        {/* Version badge */}
        <span
          className="
            hidden sm:inline-flex text-[10px] font-medium leading-none
            px-1.5 py-0.5 rounded-full
            bg-gray-100 dark:bg-white/8
            text-gray-400 dark:text-gray-500
          "
        >
          v{appVersion}
        </span>
      </div>

      {/* ── Centre: subtitle (drag handle, hidden on small windows) ─────────── */}
      <div className="absolute left-1/2 -translate-x-1/2 text-[12px] font-medium select-none pointer-events-none hidden md:block text-gray-300 dark:text-white/20">
        Healthcare Management System
      </div>

      {/* ── Right: Window controls ──────────────────────────────────────────── */}
      <div className="no-drag">
        <WindowControls />
      </div>
    </div>
  );
};

export default ElectronTitleBar;
