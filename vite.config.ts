/// <reference types="vite/client" />

import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import tailwindcss from "@tailwindcss/vite";

// 添加環境變量加載
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      host: "0.0.0.0",
      port: env.VITE_PORT ? Number(env.VITE_PORT) : 3000,
      strictPort: true,
      // 允許的 host
      allowedHosts: ["frontend-fz4o.onrender.com", "localhost", ".onrender.com"],
    },
  };
});
