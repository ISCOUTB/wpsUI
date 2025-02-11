import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path, { dirname } from "path";
import serve from "electron-serve";
import { execFile, exec } from "child_process";
import { fileURLToPath } from "url";

let isDev;
try {
  isDev = require("electron-is-dev").default;
} catch (error) {
  isDev = false;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appServe = app.isPackaged
  ? serve({
      directory: path.join(__dirname, "../out"),
    })
  : null;

let splashWindow;
let mainWindow;

const createSplash = () => {
  splashWindow = new BrowserWindow({
    width: 400,
    height: 400,
    frame: false,
    alwaysOnTop: true,
    transparent: true,
    resizable: false,
    show: false, // Se muestra después
  });

  splashWindow.loadFile(path.join(__dirname, "splash.html"));
  splashWindow.once("ready-to-show", () => splashWindow.show());
};

const createMainWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "WpsUI - UTB",
    webPreferences: {
      preload: path.join(__dirname, "/preload/preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (app.isPackaged) {
    appServe(mainWindow).then(() => {
      mainWindow.loadURL("app://-");
    });
  } else {
    mainWindow.loadURL("http://localhost:3000");
    Menu.setApplicationMenu(null);
    mainWindow.webContents.openDevTools();
  }
};

app.whenReady().then(() => {
  createSplash();

  setTimeout(() => {
    if (splashWindow) splashWindow.close();
    createMainWindow();
  }, 7000); // Precarga de 7 segundos
});

let javaProcess;

ipcMain.handle("execute-exe", async (event, exePath, args) => {
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

ipcMain.handle("get-app-path", async () => {
  let appPath = app.isPackaged
    ? app.getAppPath() + ".unpacked"
    : app.getAppPath();
  return appPath;
});

app.on("window-all-closed", () => {
  if (javaProcess) {
    if (app.isPackaged) {
      execFile(
        "taskkill",
        ["/pid", javaProcess.pid, "/f", "/t"],
        (error, stdout, stderr) => {
          if (error) console.error(stderr || error.message);
        }
      );
    } else {
      exec("taskkill /IM java.exe /F", (error, stdout, stderr) => {
        if (error) console.error(stderr || error.message);
      });
    }
  }
  if (process.platform !== "darwin") app.quit();
});
