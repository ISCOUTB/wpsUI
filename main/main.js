import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path, { dirname } from "path";
import serve from 'electron-serve'
import { execFile } from "child_process";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { kill } from "process";

let isDev
try {
  isDev = require('electron-is-dev').default
} catch (error) {
  isDev = false
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, '../out'),
    })
  : null

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "WpsUI - UTB",
    webPreferences: {
      preload: path.join(__dirname, "/preload/preload.mjs"), // Asegúrate de que el preload esté configurado aquí
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    appServe(win).then(() => {
      win.loadURL('app://-')
    })
  } else {
    win.loadURL("http://localhost:3000");
    Menu.setApplicationMenu(null);
    win.webContents.openDevTools();
  }
};

app.on("ready", createWindow);

let javaProcess;

ipcMain.handle('execute-exe', async (event, exePath, args) => {
  return new Promise((resolve, reject) => {
    javaProcess = execFile(exePath, args, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
});

ipcMain.handle('get-app-path', async () => {

  let path;

  if (app.isPackaged) {
    path = app.getAppPath() + ".unpacked";
  } else {
    path = app.getAppPath();
  }

  return path;
});

app.on("window-all-closed", () => {
  if (javaProcess) {
    if (app.isPackaged) {
      execFile("taskkill", ["/pid", javaProcess.pid, "/f", "/t"], (error, stdout, stderr) => {
        if (error) {
          console.error(stderr || error.message);
          }
      });
    } else {
      exec("taskkill /IM java.exe /F", (error, stdout, stderr) => {
        if (error) {
          console.error(stderr || error.message);
        }
    }); 
  }
  if (process.platform !== "darwin") {
    app.quit();
    }
  }
});
