import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('electronAPI', {

  executeExe: (exePath, args) => ipcRenderer.invoke('execute-exe', exePath, args),
  clearCsv: () => ipcRenderer.invoke('clear-csv'),
  on: (channel, callback) => {
    ipcRenderer.on(channel, callback)
  },
  send: (channel, args) => {
    ipcRenderer.send(channel, args)
  },

  getAppPath: () => ipcRenderer.invoke('get-app-path')


})
