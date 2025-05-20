import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path, { dirname } from "path";
import serve from "electron-serve";
import { execFile, exec } from "child_process";
import { fileURLToPath } from "url";
import fs from "fs";

app.commandLine.appendSwitch("no-sandbox");

let isDev;
try {
  isDev = require("electron-is-dev").default;
} catch (error) {
  isDev = false;
}

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const appServe = app.isPackaged
  ? serve({ directory: path.join(__dirname, "../out") })
  : null;

let mainWindow;
let splash;

const createWindow = () => {
  // Crear la ventana del splash
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    transparent: true,
    show: true,
  });

  // Determinar la ubicación del archivo splash.html
  let splashPath;
  if (app.isPackaged) {
    // En producción
    splashPath = path.join(__dirname, "splash.html");
  } else {
    // En desarrollo
    splashPath = path.join(__dirname, "../main/splash.html");
  }

  console.log("Ruta del splash:", splashPath); // Útil para depuración
  splash.loadFile(splashPath);

  // Crear la ventana principal
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "WpsUI - UTB",
    show: false,
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

  mainWindow.once("ready-to-show", () => {
    splash.destroy();
    mainWindow.show();
  });
};

app.on("ready", createWindow);

let javaProcess;

ipcMain.handle("execute-exe", async (event, exePath, args) => {
  return new Promise((resolve, reject) => {
    javaProcess = execFile(exePath, args, (error, stdout, stderr) => {
      if (error) {
        reject(stderr || error.message);
      } else {
        if(mainWindow) {
          mainWindow.webContents.send("simulation-ended");
        }
        resolve(stdout);
      }
      javaProcess = null; // Resetear la referencia al proceso
    });
  });
});

ipcMain.handle("delete-file", async (_, filePath) => {
  try {
    await fs.promises.unlink(filePath);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("get-app-path", async () => {
  return app.isPackaged ? app.getAppPath() + ".unpacked" : app.getAppPath();
});

ipcMain.handle("clear-csv", async () => {
  try {
    const csvPath = path.join(
      app.getAppPath(),
      "/src/wps/logs/wpsSimulator.csv"
    );
    fs.writeFileSync(csvPath, "");
    return { success: true, path: csvPath };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("read-csv", async () => {
  try {
    const basePath = app.isPackaged
      ? path.join(app.getAppPath(), "/src/wps/logs/wpsSimulator.csv")
      : path.join(__dirname, "/src/wps/logs/wpsSimulator.csv");

    console.log("Ruta generada para el archivo CSV:", basePath); // Log para depuración

    if (!fs.existsSync(basePath)) {
      console.error("Archivo CSV no encontrado en la ruta:", basePath);
      return { success: false, error: "Archivo no encontrado" };
    }

    const data = fs.readFileSync(basePath, "utf-8");
    if (!data.trim()) {
      console.error("Archivo CSV vacío en la ruta:", basePath);
      return { success: false, error: "Archivo CSV vacío" };
    }

    console.log("Datos leídos del archivo CSV:", data); // Log para verificar el contenido
    return { success: true, data };
  } catch (error) {
    console.error("Error leyendo el archivo CSV:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("file-exists", async (event, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle("kill-java-process", async () => {
  if (javaProcess) {
    try {
      if (app.isPackaged) {
        execFile("taskkill", ["/pid", javaProcess.pid, "/f", "/t"], () => {});
      } else {
        exec("taskkill /IM java.exe /F", () => {});
      }
      // Resetear la referencia al proceso
      javaProcess = null;
      if (mainWindow) {
        mainWindow.webContents.send("simulation-ended");
      }
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  } else {
    return { success: false, message: "No hay proceso Java activo" };
  }
});

ipcMain.handle("check-java-process", async () => {
  return { running: !!javaProcess };
});

// Agregar este manejador para cerrar el proceso Java cuando se cierra la aplicación
app.on("window-all-closed", () => {
  if (javaProcess) {
    try {
      if (app.isPackaged) {
        execFile("taskkill", ["/pid", javaProcess.pid, "/f", "/t"], () => {});
      } else {
        exec("taskkill /IM java.exe /F", () => {});
      }
      javaProcess = null;
    } catch (error) {
      console.error("Error al cerrar proceso Java:", error);
    }
  }

  if (process.platform !== "darwin") {
    app.quit();
  }
});
