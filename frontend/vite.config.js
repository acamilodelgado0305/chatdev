import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const URL= import.meta.env.VITE_BACKEND_URL || "http://localhost:8080";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
});
