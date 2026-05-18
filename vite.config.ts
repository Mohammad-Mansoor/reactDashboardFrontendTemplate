import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import svgr from "vite-plugin-svgr";

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react(),
    svgr({
      svgrOptions: { icon: true },
    }),
  ],
  server: {
    port: 3000,
    allowedHosts: ["*"],
  },
  // When --mode electron is passed, use relative paths so the packaged
  // Electron app works correctly under file:// protocol.
  base: mode === "electron" ? "./" : "/",
}));
