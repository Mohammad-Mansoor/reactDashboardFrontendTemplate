const { BrowserWindow, app } = require("electron");
const path = require("path");

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 800,
    minHeight: 600,

    frame: false,
    show: false,

    // Use the app icon from assets
    icon: path.join(__dirname, "../assets/icon.png"),

    webPreferences: {
      preload: path.join(__dirname, "../preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      // Harden the renderer
      sandbox: true,
      webSecurity: true,
      allowRunningInsecureContent: false,
    },
  });

  if (app.isPackaged) {
    // Production: load the built React app from the packaged dist folder
    win.loadFile(path.join(__dirname, "../../dist/index.html"));
  } else {
    // Development: load from the Vite dev server
    win.loadURL("http://localhost:3000");
    // Open DevTools only in dev
    win.webContents.openDevTools({ mode: "detach" });
  }

  return win;
}

module.exports = createMainWindow;