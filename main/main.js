import { app, BrowserWindow, Menu } from 'electron'
import path, { dirname } from 'path'
import serve from 'electron-serve'
import { fileURLToPath } from 'url'

let isDev
try {
  isDev = require('electron-is-dev').default
} catch (error) {
  isDev = false
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, '../out'),
    })
  : null

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1280,
    height: 720,
    title: 'WpsUI - UTB',
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL('app://-')
    })
  } else {
    win.loadURL('http://localhost:3000')
    Menu.setApplicationMenu(null)
    // win.webContents.openDevTools();
    win.webContents.on('did-fail-load', (e, code, desc) => {
      win.webContents.reloadIgnoringCache()
    })
  }
}

app.on('ready', () => {
  createWindow()
})

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})
