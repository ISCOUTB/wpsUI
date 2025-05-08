export interface ElectronAPI {
  readCsv: () => Promise<{ success: boolean; data?: string; error?: string }>;
  deleteFile: (path: string) => Promise<{ success: boolean; error?: string }>;
  executeExe: (exePath: string, args: string[]) => Promise<string>;
  clearCsv: () => Promise<{ success: boolean; path?: string; error?: string }>;
  fileExists: (filePath: string) => Promise<boolean>;
  killJavaProcess: () => Promise<{ success: boolean; error?: string }>;
  getAppPath: () => Promise<string>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
