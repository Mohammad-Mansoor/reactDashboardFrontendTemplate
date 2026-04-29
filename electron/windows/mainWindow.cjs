const { BrowserWindow } = require("electron");
const path = require("path");

function createMainWindow() {
  const win = new BrowserWindow({
    width: 1200,
    height: 800,

    frame: false,
    show: false,

    webPreferences: {
      preload: path.join(__dirname, "../preload.cjs"),
      contextIsolation: true,
      nodeIntegration: false,
    }
  });

  win.loadURL("http://localhost:3000");

  return win;
}

module.exports = createMainWindow;