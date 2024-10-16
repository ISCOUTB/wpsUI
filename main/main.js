import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path, { dirname } from "path";
import isDev from "electron-is-dev";
import { exec } from "child_process";


import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.disableHardwareAcceleration();

const createWindow = () => {
  const win = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "WpsUI - UTB",
    webPreferences: {
      preload: path.join(__dirname, "/preload/preload.mjs"), // Asegúrate de que el preload esté configurado aquí
      nodeIntegration: true,
      contextIsolation: true,
      sandbox: false,  
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
    Menu.setApplicationMenu(null);
    win.webContents.openDevTools();
  } else {
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }
};

let javaProcess;

ipcMain.handle('execute-exe', async (event, command) => {
  return new Promise((resolve, reject) => {
     javaProcess = exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        resolve(stdout);
      }
    });
  });
});

ipcMain.handle('get-app-path', async () => {
  return app.getAppPath()
});

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (javaProcess) {
    exec("taskkill /IM java.exe /F");
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});