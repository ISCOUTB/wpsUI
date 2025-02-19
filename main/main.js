import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path, { dirname } from "path";
import serve from 'electron-serve'
import { execFile } from "child_process";
import { exec } from "child_process";
import { fileURLToPath } from "url";
import { kill } from "process";
import fs from 'fs';
app.commandLine.appendSwitch('no-sandbox');
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

ipcMain.handle('delete-file', async (_, path) => {
  try {
    await fs.promises.unlink(path);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
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


ipcMain.handle('clear-csv', async (event) => {
  const appPath = app.getAppPath();
  const csvPath = path.join(appPath, '/src/wps/logs/wpsSimulator.csv');

  try {
    
    fs.writeFileSync(csvPath, '');
    return { success: true, path: csvPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle('read-csv', async () => {
  try {
    const appPath = app.getAppPath();
    const csvPath = path.join(appPath, '/src/wps/logs/wpsSimulator.csv');

    if (!fs.existsSync(csvPath)) {
      return { success: false, error: "Archivo no encontrado" };
    }

    const data = fs.readFileSync(csvPath, "utf-8");
    return { success: true, data };
  } catch (error) {
    return { success: false, error: error.message };
  }
});


ipcMain.handle('file-exists', async (event, filePath) => {
  return fs.existsSync(filePath);
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
