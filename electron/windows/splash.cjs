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
    webPreferences: {
      preload: path.join(__dirname, "../preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  splash.loadFile(path.join(__dirname, "../ui/splash.html"));

  return splash;
}

module.exports = createSplash;