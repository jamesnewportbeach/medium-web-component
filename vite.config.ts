import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  define: {
    "process.env": {
      NODE_ENV: "production",
    },
  },
  plugins: [react()],
  build: {
    lib: {
      entry: "./src/index.tsx",
      name: "polygon-canvas",
      fileName: (format) => `polygon-canvas.${format}.js`,
    },
    target: "es2015",
  },
});
