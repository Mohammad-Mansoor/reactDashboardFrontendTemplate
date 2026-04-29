const { contextBridge, ipcRenderer } = require("electron");
console.log("🔥 PRELOAD LOADED"); // <-- this is correct
contextBridge.exposeInMainWorld("electronAPI", {
  send: (channel, data) => ipcRenderer.send(channel, data),
  on: (channel, callback) => {
    ipcRenderer.on(channel, (_, data) => callback(data));
  }
  
});
// console.log("PRELOAD LOADED ✅");