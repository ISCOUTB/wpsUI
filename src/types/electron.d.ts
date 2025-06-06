export interface ElectronAPI {
  localStorage: {
    getItem: (key: string) => string | null;
    setItem: (key: string, value: string) => void;
    removeItem: (key: string) => void;
  };
  readCsv: () => Promise<{ success: boolean; data?: string; error?: string }>;
  deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>;
  executeExe: (exePath: string, args: string[]) => Promise<string>;
  clearCsv: () => Promise<{ success: boolean; path?: string; error?: string }>;
  
  fileExists: (filePath: string) => Promise<boolean>;
  on: (channel: string, listener: (...args: any[]) => void) => void;
  removeListener: (channel: string, listener: (...args: any[]) => void) => void;
  killJavaProcess: () => Promise<{ success: boolean; error?: string }>;
  getAppPath: () => Promise<string>;
  
  // Nuevas funciones para manejo de rutas en macOS
  isPackagedMac: () => Promise<boolean>;
  getUserDataPath: () => Promise<string>;
  
  // Opcional: función para abrir la carpeta de logs
  openLogsFolder?: () => Promise<{ success: boolean; error?: string }>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}