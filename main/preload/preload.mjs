import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("electronAPI", {
  readCsv: () => ipcRenderer.invoke("read-csv"),
  deleteFile: (path) => ipcRenderer.invoke("delete-file", path),
  executeExe: (exePath, args) =>
    ipcRenderer.invoke("execute-exe", exePath, args),
  clearCsv: () => ipcRenderer.invoke("clear-csv"),
  fileExists: (filePath) => ipcRenderer.invoke("file-exists", filePath),
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback);
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args);
  },

  getAppPath: () => ipcRenderer.invoke("get-app-path"),
});
