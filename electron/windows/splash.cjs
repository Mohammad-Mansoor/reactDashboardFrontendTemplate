const { BrowserWindow } = require("electron");
const path = require("path");

function createSplash() {
  const splash = new BrowserWindow({
    width: 500,
    height: 350,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    resizable: false,
    center: true,
    skipTaskbar: true,

    webPreferences: {
      // Use the dedicated minimal splash preload — NOT the full app preload
      preload: path.join(__dirname, "../preload-splash.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  splash.loadFile(path.join(__dirname, "../ui/splash.html"));

  return splash;
}

module.exports = createSplash;