const { app, ipcMain, BrowserWindow } = require("electron");
const createSplash = require("./windows/splash.cjs");
const createMainWindow = require("./windows/mainWindow.cjs");

// ===============================
// 🚀 APP STARTUP + SPLASH LOADER
// ===============================
app.whenReady().then(() => {
  const splash = createSplash();

  splash.webContents.on("did-finish-load", () => {
    console.log("Splash loaded ✅");

    let progress = 0;

    const interval = setInterval(() => {
      // Smooth realistic loading
      if (progress < 70) progress += 5;
      else if (progress < 90) progress += 2;

      splash.webContents.send("loading-progress", progress);
    }, 120);

    // Create main window (hidden first)
    const main = createMainWindow();

    main.webContents.on("did-finish-load", () => {
      console.log("Main app loaded ✅");

      clearInterval(interval);

      let finish = progress;

      const finishInterval = setInterval(() => {
        finish += 2;

        splash.webContents.send("loading-progress", finish);

        if (finish >= 100) {
          clearInterval(finishInterval);

          setTimeout(() => {
            splash.close();
            main.show();
          }, 250);
        }
      }, 25);
    });
  });
});

// ===============================
// 🪟 WINDOW CONTROL HELPERS
// ===============================
function getWindow() {
  return BrowserWindow.getAllWindows().find(w => !w.isDestroyed());
}

// ===============================
// 🪟 IPC WINDOW CONTROLS
// ===============================

ipcMain.on("window-minimize", () => {
  const win = getWindow();
  if (win) win.minimize();
});

ipcMain.on("window-maximize", () => {
  const win = getWindow();
  if (!win) return;

  if (win.isMaximized()) {
    win.unmaximize();
  } else {
    win.maximize();
  }
});

ipcMain.on("window-close", () => {
  const win = getWindow();
  if (win) win.close();
});