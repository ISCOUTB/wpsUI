import { app, BrowserWindow, Menu, ipcMain } from "electron";
import path, { dirname } from "path";
import serve from "electron-serve";
import { execFile, exec, execSync } from "child_process";
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

// Variable para almacenar la ruta activa para los CSV
let activeLogsPath = null;

const createWindow = () => {
  // 1) Ventana splash
  splash = new BrowserWindow({
    width: 400,
    height: 300,
    frame: false,
    alwaysOnTop: true,
    resizable: false,
    transparent: true,
    show: true,
  });

  const splashPath = app.isPackaged
    ? path.join(__dirname, "splash.html")
    : path.join(__dirname, "../main/splash.html");
  splash.loadFile(splashPath);

  // 2) Ventana principal
  mainWindow = new BrowserWindow({
    width: 1920,
    height: 1080,
    title: "WpsUI - UTB",
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "/preload/preload.mjs"),
      nodeIntegration: true,
      contextIsolation: true,
      webSecurity: true,
      sandbox: false,
      allowRunningInsecureContent: false,
      experimentalFeatures: false,
    },
  });

  // — Eliminar menú por defecto (File, Edit, View, Window, Help)
  Menu.setApplicationMenu(null);

  // — Bloquear atajos de DevTools EN PRODUCCIÓN
  if (!isDev) {
    mainWindow.webContents.on("before-input-event", (event, input) => {
      const key = input.key.toLowerCase();
      const ctrlOrCmd = process.platform === "darwin" ? input.meta : input.control;
      if (
        (ctrlOrCmd && input.shift && key === "i") ||
        input.key === "F12" ||
        (process.platform === "darwin" && input.meta && input.alt && key === "i")
      ) {
        event.preventDefault();
      }
    });
  }

  // 3) Carga de contenido según entorno
  if (app.isPackaged) {
    appServe(mainWindow).then(() => {
      mainWindow.loadURL("app://-");
    });
  } else {
    mainWindow.loadURL("http://localhost:3000");
    // — Solo en desarrollo: abrir DevTools
    mainWindow.webContents.openDevTools();
  }

  // 4) Mostrar la ventana principal cuando esté lista
  mainWindow.once("ready-to-show", () => {
    splash.destroy();
    mainWindow.show();
  });
};

app.on("ready", createWindow);

// ---------------------- IPC y gestión de procesos Java ----------------------

let javaProcess;

// Función de utilidad para obtener rutas consistentes en macOS empaquetado
const getMacResourcePath = (subPath) => {
  // Sube dos niveles: de Contents/MacOS a Contents
  const contentsPath = path.dirname(path.dirname(app.getPath('exe')));
  return path.join(contentsPath, 'Resources', subPath);
};

// Función para obtener el directorio de trabajo para Java
const getWorkingDirectory = () => {
  if (app.isPackaged && process.platform === "darwin") {
    // En macOS empaquetado, usamos un directorio con permisos de escritura
    const userDataDir = app.getPath('userData');
    const workDir = path.join(userDataDir, 'working');
    
    // Crear el directorio si no existe
    if (!fs.existsSync(workDir)) {
      fs.mkdirSync(workDir, { recursive: true });
    }
    
    // Crear subdirectorio logs que es donde Java escribirá los CSV
    const logsDir = path.join(workDir, 'logs');
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    // Actualizar la ruta activa para los CSV
    activeLogsPath = logsDir;
    return workDir;
  }
  
  // En desarrollo o en Windows, usamos la ruta por defecto
  return process.cwd();
};

// Reemplaza la función execute-exe actual
ipcMain.handle("execute-exe", async (event, exePath, args) => {
  return new Promise((resolve, reject) => {
    // Verificar si el JAR existe
    let actualExePath = exePath;
    
    // Ajustar la ruta del JAR para versiones empaquetadas
    if (app.isPackaged) {
      if (process.platform === "darwin") {
        // En macOS empaquetado: AppName.app/Contents/Resources/src/wps/archivo.jar
        actualExePath = getMacResourcePath('src/wps/wpsSimulator-1.0.jar');
      } else if (process.platform === "win32") {
        // En Windows empaquetado
        actualExePath = path.join(
          app.getAppPath(), 
          "src/wps/wpsSimulator-1.0.jar"
        );
      }
      console.log(`Ruta del JAR ajustada para entorno empaquetado: ${actualExePath}`);
    }
    
    // Verificar que el archivo JAR existe
    if (!fs.existsSync(actualExePath)) {
      console.error(`El archivo JAR no existe en: ${actualExePath}`);
      return reject(`El archivo JAR no se encuentra en: ${actualExePath}`);
    }
    
    // Verificar tamaño para comprobar que no es un archivo Git LFS
    try {
      const stats = fs.statSync(actualExePath);
      if (stats.size < 10000) {
        const fileContent = fs.readFileSync(actualExePath, 'utf8', { encoding: 'utf8' });
        if (fileContent.includes('git-lfs')) {
          return reject(`El archivo JAR es un puntero Git LFS, no el archivo real. Ejecuta 'git lfs pull' para descargar el archivo.`);
        } else if (stats.size < 10000) {
          console.warn(`El archivo JAR parece pequeño (${stats.size} bytes), podría estar corrupto.`);
        }
      }
      console.log(`JAR encontrado con tamaño: ${stats.size} bytes`);
    } catch (error) {
      console.error(`Error verificando JAR:`, error);
    }
    
    // Guardar directorio actual
    const originalDir = process.cwd();
    
    // Cambiar al directorio de trabajo con permisos (solo en macOS empaquetado)
    const workingDir = getWorkingDirectory();
    if (workingDir !== originalDir) {
      process.chdir(workingDir);
      console.log(`Directorio de trabajo cambiado de ${originalDir} a: ${workingDir}`);
    }
    
    // Construir argumentos correctamente: -jar exePath [args]
    const allArgs = ["-jar", actualExePath, ...args];
    
    let javaPath = "";
    
    if (process.platform === "win32") {
      // Windows: usar Java incluido
      javaPath = app.isPackaged 
        ? path.join(app.getAppPath(), "src/wps/JreWin/bin/java.exe")
        : path.join(__dirname, "../src/wps/JreWin/bin/java.exe");
    } else if (process.platform === "darwin") {
      try {
        // macOS: primero intentar usar Java del sistema
        javaPath = execSync('which java', { encoding: 'utf8' }).trim();
        console.log(`Java encontrado en: ${javaPath}`);
        
        // Verificar versión
        const javaVersion = execSync(`${javaPath} -version 2>&1`, { encoding: 'utf8' });
        console.log(`Versión de Java: ${javaVersion}`);
      } catch (error) {
        // Si no encuentra Java, probar ubicaciones comunes
        console.warn('Error buscando Java con which:', error.message);
        
        const possiblePaths = [
          "/usr/bin/java",
          "/usr/local/bin/java",
          "/Library/Java/JavaVirtualMachines/temurin-17.jdk/Contents/Home/bin/java",
          "/opt/homebrew/bin/java"
        ];
        
        // Añadir la ruta del JRE incluido, según si está empaquetado o no
        if (app.isPackaged) {
          possiblePaths.push(getMacResourcePath('src/wps/JreMac/Home/bin/java'));
        } else {
          possiblePaths.push(path.join(__dirname, "../src/wps/JreMac/Home/bin/java"));
        }
        
        let javaFound = false;
        for (const possiblePath of possiblePaths) {
          if (fs.existsSync(possiblePath)) {
            javaPath = possiblePath;
            javaFound = true;
            console.log(`Java encontrado en: ${javaPath}`);
            break;
          }
        }
        
        if (!javaFound) {
          process.chdir(originalDir); // Restaurar directorio original
          return reject("No se encontró Java en el sistema. Por favor instala Java.");
        }
      }
      
      console.log(`Ejecutando Java desde: ${javaPath}`);
      console.log(`Con argumentos: ${allArgs.join(' ')}`);
      console.log(`Directorio actual: ${process.cwd()}`);
      
      // Usar exec para macOS
      const command = `"${javaPath}" ${allArgs.join(' ')}`;
      javaProcess = exec(command, (error, stdout, stderr) => {
        // Restaurar directorio original después de ejecutar Java
        process.chdir(originalDir);
        
        // Verificar si se han generado archivos CSV
        if (activeLogsPath) {
          try {
            const files = fs.readdirSync(activeLogsPath);
            const csvFiles = files.filter(f => f.endsWith('.csv'));
            console.log(`CSV generados en ${activeLogsPath}: ${csvFiles.join(', ')}`);
          } catch (e) {
            console.error("Error verificando CSV generados:", e);
          }
        }
        
        if (error) {
          console.error("Error ejecutando Java:", error);
          reject(stderr || error.message);
        } else {
          mainWindow?.webContents.send("simulation-ended");
          resolve(stdout);
        }
        javaProcess = null;
      });
      
      return; // Importante: retornar aquí para no ejecutar el código de abajo
    } else {
      // Linux: usar Java incluido o del sistema
      javaPath = app.isPackaged
        ? path.join(app.getAppPath(), "src/wps/JreLinux/bin/java")
        : path.join(__dirname, "../src/wps/JreLinux/bin/java");
      
      // Si no existe, intentar con Java del sistema
      if (!fs.existsSync(javaPath)) {
        try {
          javaPath = execSync('which java', { encoding: 'utf8' }).trim();
        } catch (error) {
          process.chdir(originalDir); // Restaurar directorio original
          return reject("No se encontró Java en el sistema Linux");
        }
      }
    }
    
    // Código para Windows y Linux
    console.log(`Ejecutando Java desde: ${javaPath}`);
    console.log(`Con argumentos: ${allArgs.join(' ')}`);
    console.log(`Directorio actual: ${process.cwd()}`);
    
    javaProcess = execFile(javaPath, allArgs, (error, stdout, stderr) => {
      // Restaurar directorio original
      process.chdir(originalDir);
      
      if (error) {
        console.error("Error ejecutando Java:", error);
        reject(stderr || error.message);
      } else {
        mainWindow?.webContents.send("simulation-ended");
        resolve(stdout);
      }
      javaProcess = null;
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
  return app.isPackaged
    ? app.getAppPath() + ".unpacked"
    : app.getAppPath();
});

ipcMain.handle("clear-csv", async () => {
  try {
    // Determinar ruta base según plataforma y empaquetado
    let csvPath;
    
    if (activeLogsPath && app.isPackaged && process.platform === "darwin") {
      // Usar la ruta donde Java escribe los CSV en macOS empaquetado
      csvPath = path.join(activeLogsPath, "wpsSimulator.csv");
    } else if (app.isPackaged) {
      if (process.platform === "darwin") {
        // En macOS empaquetado original (si no tenemos activeLogsPath)
        csvPath = getMacResourcePath('logs/wpsSimulator.csv');
      } else {
        // En Windows empaquetado
        csvPath = path.join(app.getAppPath(), "logs/wpsSimulator.csv");
      }
    } else {
      // En desarrollo (cualquier plataforma)
      csvPath = path.join(__dirname, "../logs/wpsSimulator.csv");
    }
    
    // Asegurar que el directorio existe
    const logsDir = path.dirname(csvPath);
    if (!fs.existsSync(logsDir)) {
      fs.mkdirSync(logsDir, { recursive: true });
    }
    
    fs.writeFileSync(csvPath, "");
    console.log("CSV limpiado en:", csvPath);
    return { success: true, path: csvPath };
  } catch (error) {
    console.error("Error limpiando CSV:", error);
    return { success: false, error: error.message };
  }
});

ipcMain.handle("read-csv", async () => {
  try {
    // Determinar ruta base según plataforma y empaquetado
    let basePath;
    
    if (activeLogsPath && app.isPackaged && process.platform === "darwin") {
      // Usar la ruta donde Java escribe los CSV en macOS empaquetado
      basePath = path.join(activeLogsPath, "wpsSimulator.csv");
    } else if (app.isPackaged) {
      if (process.platform === "darwin") {
        // En macOS empaquetado original (si no tenemos activeLogsPath)
        basePath = getMacResourcePath('logs/wpsSimulator.csv');
      } else {
        // En Windows empaquetado
        basePath = path.join(app.getAppPath(), "logs/wpsSimulator.csv");
      }
    } else {
      // En desarrollo (cualquier plataforma)
      basePath = path.join(__dirname, "../logs/wpsSimulator.csv");
    }

    console.log("Buscando CSV en:", basePath);

    if (!fs.existsSync(basePath)) {
      // Intentar crear el directorio si no existe
      const logsDir = path.dirname(basePath);
      if (!fs.existsSync(logsDir)) {
        fs.mkdirSync(logsDir, { recursive: true });
        fs.writeFileSync(basePath, ""); // Crear archivo vacío
        return { success: false, error: "Archivo CSV creado pero está vacío" };
      }
      return { success: false, error: "Archivo no encontrado" };
    }

    const data = fs.readFileSync(basePath, "utf-8");
    if (!data.trim()) {
      return { success: false, error: "Archivo CSV vacío" };
    }

    return { success: true, data };
  } catch (error) {
    console.error("Error leyendo CSV:", error);
    return { success: false, error: error.message };
  }
});

// Nuevo manejador para mostrar dónde están los CSV
ipcMain.handle("get-logs-path", async () => {
  if (activeLogsPath) {
    try {
      const files = fs.readdirSync(activeLogsPath);
      return { 
        path: activeLogsPath,
        files: files.filter(f => f.endsWith('.csv'))
      };
    } catch (error) {
      return { error: error.message };
    }
  }
  
  return { path: "No se ha establecido una ruta de logs activa" };
});

ipcMain.handle("file-exists", async (_, filePath) => {
  return fs.existsSync(filePath);
});

ipcMain.handle("kill-java-process", async () => {
  if (!javaProcess) {
    return { success: false, message: "No hay proceso Java activo" };
  }
  try {
    if (process.platform === "win32") {
      execFile("taskkill", ["/pid", javaProcess.pid, "/f", "/t"]);
    } else {
      // En macOS/Linux usamos señales del sistema
      javaProcess.kill('SIGTERM');
    }
    javaProcess = null;
    mainWindow?.webContents.send("simulation-ended");
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
});

ipcMain.handle("check-java-process", async () => {
  return { running: Boolean(javaProcess) };
});

app.on("window-all-closed", () => {
  if (javaProcess) {
    try {
      if (process.platform === "win32") {
        execFile("taskkill", ["/pid", javaProcess.pid, "/f", "/t"]);
      } else {
        // En macOS/Linux usamos señales del sistema
        javaProcess.kill('SIGTERM');
      }
    } catch (error) {
      console.error("Error al cerrar proceso Java:", error);
    }
    javaProcess = null;
  }
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // En macOS es común volver a crear una ventana cuando
  // se hace clic en el icono del dock y no hay otras ventanas abiertas.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
// Agregar estos handlers
ipcMain.handle("is-packaged-mac", async () => {
  return app.isPackaged && process.platform === "darwin";
});

ipcMain.handle("get-user-data-path", async () => {
  return app.getPath('userData');
});