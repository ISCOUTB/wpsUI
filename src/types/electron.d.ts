export interface ElectronAPI {
  getAppPath: () => Promise<string>;
  fileExists: (path: string) => Promise<boolean>;
  deleteFile: (path: string) => Promise<void>;
  executeExe: (path: string, args: string[]) => Promise<void>;
}

declare global {
  interface Window {
    electronAPI: ElectronAPI;
  }
}
