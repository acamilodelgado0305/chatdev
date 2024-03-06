import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import "dotenv/config"

const URL= process.env.VITE_BACKEND_URL || "http://localhost:8080";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      "/socket.io": {
        target: URL,
        ws: true,
      },
    },
  }
});
