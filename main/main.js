import { app, BrowserWindow, Menu } from "electron";
import path, { dirname } from "path";
import isDev from "electron-is-dev";

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
      preload: path.join(__dirname, "preload.js"), // Asegúrate de que el preload esté configurado aquí
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (isDev) {
    win.loadURL("http://localhost:3000");
    Menu.setApplicationMenu(null);
  } else {
    win.loadFile(path.join(__dirname, "../out/index.html"));
  }
};

app.on("ready", createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
