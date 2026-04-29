export {};

declare global {
  interface Window {
    electronAPI: {
      send: (channel: string, data?: any) => void;
      on: (channel: string, callback: (data: any) => void) => void;
    };
  }
}