import React, { useEffect, useState } from "react";
import { Minus, X } from "lucide-react";

// ─── Window Controls ──────────────────────────────────────────────────────────
const send = (channel: string) => {
  if (!window.electronAPI) return;
  window.electronAPI.send(channel);
};

// ─── Maximise Icon — tracks actual window state ──────────────────────────────
const MaximizeIcon = ({ isMaximized }: { isMaximized: boolean }) => (
  <svg width="13" height="13" viewBox="0 0 13 13" fill="none">
    {isMaximized ? (
      /* Restore icon */
      <>
        <rect x="2.5" y="4.5" width="7" height="7" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
        <path d="M4.5 4V3a.5.5 0 0 1 .5-.5h6a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-.5.5H10" stroke="currentColor" strokeWidth="1.4" />
      </>
    ) : (
      /* Maximize icon */
      <rect x="1.5" y="1.5" width="10" height="10" rx="0.5" stroke="currentColor" strokeWidth="1.4" />
    )}
  </svg>
);

// ─── Component ────────────────────────────────────────────────────────────────
const WindowControls: React.FC = () => {
  const [isMaximized, setIsMaximized] = useState(false);

  // Sync maximise state from main process
  useEffect(() => {
    if (!window.electronAPI) return;

    const cleanup = window.electronAPI.on("window-maximized-state", (val) => {
      setIsMaximized(val as boolean);
    });
    return cleanup;
  }, []);

  return (
    <div className="flex items-center gap-0.5" id="window-controls">

      {/* ── Minimize ── */}
      <button
        id="btn-minimize"
        onClick={() => send("window-minimize")}
        title="Minimize"
        className="
          group relative flex h-8 w-10 items-center justify-center
          rounded-md text-gray-500 dark:text-gray-400
          hover:bg-gray-100/80 dark:hover:bg-white/8
          active:bg-gray-200/60 dark:active:bg-white/12
          transition-all duration-150
        "
      >
        <Minus
          size={15}
          strokeWidth={2}
          className="transition-transform duration-150 group-hover:scale-110"
        />
      </button>

      {/* ── Maximize / Restore ── */}
      <button
        id="btn-maximize"
        onClick={() => send("window-maximize")}
        title={isMaximized ? "Restore" : "Maximize"}
        className="
          group relative flex h-8 w-10 items-center justify-center
          rounded-md text-gray-500 dark:text-gray-400
          hover:bg-gray-100/80 dark:hover:bg-white/8
          active:bg-gray-200/60 dark:active:bg-white/12
          transition-all duration-150
        "
      >
        <span className="transition-transform duration-150 group-hover:scale-110">
          <MaximizeIcon isMaximized={isMaximized} />
        </span>
      </button>

      {/* ── Close ── */}
      <button
        id="btn-close"
        onClick={() => send("window-close")}
        title="Close"
        className="
          group relative flex h-8 w-10 items-center justify-center
          rounded-md text-gray-500 dark:text-gray-400
          hover:bg-red-500 hover:text-white
          active:bg-red-600
          transition-all duration-150
        "
      >
        <X
          size={15}
          strokeWidth={2}
          className="transition-transform duration-150 group-hover:scale-110"
        />
      </button>

    </div>
  );
};

export default WindowControls;