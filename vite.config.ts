import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/mandydennis-art/",
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          motion: ["motion", "motion/react"],
        },
      },
    },
  },
});
