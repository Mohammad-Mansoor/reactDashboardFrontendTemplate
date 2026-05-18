const { app, ipcMain, BrowserWindow, dialog, shell } = require("electron");
const path = require("path");
const createSplash = require("./windows/splash.cjs");
const createMainWindow = require("./windows/mainWindow.cjs");

// ─────────────────────────────────────────────────────────────────────────────
// Auto-Updater (production only)
// ─────────────────────────────────────────────────────────────────────────────
let autoUpdater = null;
if (app.isPackaged) {
  try {
    autoUpdater = require("electron-updater").autoUpdater;
    autoUpdater.logger = require("electron-log");
    autoUpdater.logger.transports.fileLog.level = "info";
    autoUpdater.autoDownload = false; // Ask user before downloading
  } catch {
    // electron-updater not available in this environment
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Single-Instance Lock — prevent multiple windows in a healthcare context
// ─────────────────────────────────────────────────────────────────────────────
const gotTheLock = app.requestSingleInstanceLock();

if (!gotTheLock) {
  // Another instance is already running — quit this one immediately
  app.quit();
} else {
  // A second instance was opened — focus our existing window
  app.on("second-instance", () => {
    const win = getMainWindow();
    if (win) {
      if (win.isMinimized()) win.restore();
      win.focus();
    }
  });

  // ─── APP LIFECYCLE ───────────────────────────────────────────────────────
  app.whenReady().then(bootApp);

  app.on("window-all-closed", () => {
    // On macOS apps conventionally stay active until Cmd+Q
    if (process.platform !== "darwin") {
      app.quit();
    }
  });

  app.on("activate", () => {
    // On macOS re-create the window when dock icon is clicked and no windows exist
    if (BrowserWindow.getAllWindows().length === 0) {
      bootApp();
    }
  });

  // Prevent navigation to external URLs (security hardening)
  app.on("web-contents-created", (_, contents) => {
    contents.on("will-navigate", (event, navigationUrl) => {
      const parsedUrl = new URL(navigationUrl);
      const isDev = !app.isPackaged;
      const isLocalhost = parsedUrl.hostname === "localhost";
      const isFileProtocol = parsedUrl.protocol === "file:";

      if (!isDev && !isFileProtocol) {
        event.preventDefault();
      }
      if (isDev && !isLocalhost && !isFileProtocol) {
        event.preventDefault();
      }
    });

    // Open external links in the system browser, not in Electron
    contents.setWindowOpenHandler(({ url }) => {
      if (url.startsWith("https://") || url.startsWith("http://")) {
        shell.openExternal(url);
      }
      return { action: "deny" };
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// BOOT SEQUENCE
// ─────────────────────────────────────────────────────────────────────────────
const MINIMUM_SPLASH_DURATION_MS = 1500; // Ensure branding moment is never skipped

function bootApp() {
  const splash = createSplash();
  const splashStartTime = Date.now();

  splash.webContents.on("did-finish-load", () => {
    let progress = 0;

    // Simulate realistic loading progress
    const interval = setInterval(() => {
      if (splash.isDestroyed()) { clearInterval(interval); return; }
      if (progress < 70) progress += 5;
      else if (progress < 90) progress += 2;
      splash.webContents.send("loading-progress", progress);
    }, 120);

    // Create the main window (hidden) while splash is showing
    const main = createMainWindow();
    attachMaximizeSync(main);

    // Handle load failure gracefully — don't hang on splash forever
    main.webContents.on("did-fail-load", (_, errorCode, errorDescription) => {
      clearInterval(interval);
      splash.close();

      dialog.showErrorBox(
        "HCMS — Failed to Load",
        `The application could not load.\n\nError: ${errorDescription} (${errorCode})\n\nPlease restart the application. If the problem persists, contact your system administrator.`
      );
      app.quit();
    });

    main.webContents.on("did-finish-load", () => {
      clearInterval(interval);

      // Enforce minimum splash duration so branding isn't skipped on fast machines
      const elapsed = Date.now() - splashStartTime;
      const remaining = Math.max(0, MINIMUM_SPLASH_DURATION_MS - elapsed);

      setTimeout(() => {
        let finish = progress;

        const finishInterval = setInterval(() => {
          finish += 3;

          // Guard: splash may have been closed/destroyed before the interval fires
          if (splash.isDestroyed()) {
            clearInterval(finishInterval);
            main.show();
            main.focus();
            if (autoUpdater) setupAutoUpdater(main);
            return;
          }

          splash.webContents.send("loading-progress", finish);

          if (finish >= 100) {
            clearInterval(finishInterval);
            setTimeout(() => {
              if (!splash.isDestroyed()) splash.close();
              main.show();
              main.focus();
              if (autoUpdater) setupAutoUpdater(main);
            }, 250);
          }
        }, 20);
      }, remaining);
    });
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// AUTO-UPDATER SETUP
// ─────────────────────────────────────────────────────────────────────────────
function setupAutoUpdater(win) {
  if (!autoUpdater) return;

  autoUpdater.on("update-available", (info) => {
    win.webContents.send("update-available", info);
  });

  autoUpdater.on("update-downloaded", (info) => {
    win.webContents.send("update-downloaded", info);
  });

  autoUpdater.on("error", (err) => {
    // Silently log — don't interrupt the user for update errors
    console.error("[updater] Error:", err?.message);
  });

  // Check after a 3-second delay so the UI has time to settle
  setTimeout(() => autoUpdater.checkForUpdates(), 3000);
}

// ─────────────────────────────────────────────────────────────────────────────
// WINDOW HELPERS
// ─────────────────────────────────────────────────────────────────────────────
function getMainWindow() {
  return BrowserWindow.getAllWindows().find(
    (w) => !w.isDestroyed() && !w.getTitle().includes("splash")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// IPC — WINDOW CONTROLS
// ─────────────────────────────────────────────────────────────────────────────
ipcMain.on("window-minimize", () => {
  const win = getMainWindow();
  if (win) win.minimize();
});

ipcMain.on("window-maximize", () => {
  const win = getMainWindow();
  if (!win) return;
  win.isMaximized() ? win.unmaximize() : win.maximize();
});

ipcMain.on("window-close", () => {
  const win = getMainWindow();
  if (win) win.close();
});

// Push maximize state to renderer so the button icon stays in sync
function attachMaximizeSync(win) {
  const send = (state) => {
    if (!win.isDestroyed()) {
      win.webContents.send("window-maximized-state", state);
    }
  };
  win.on("maximize", () => send(true));
  win.on("unmaximize", () => send(false));
}

// ─────────────────────────────────────────────────────────────────────────────
// IPC — AUTO-UPDATER CONTROLS (triggered from renderer)
// ─────────────────────────────────────────────────────────────────────────────
ipcMain.on("install-update", () => {
  if (autoUpdater) {
    autoUpdater.downloadUpdate();
  }
});

ipcMain.on("restart-and-install", () => {
  if (autoUpdater) {
    autoUpdater.quitAndInstall();
  }
});