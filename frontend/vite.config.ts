import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

export default defineConfig(({ mode }) => ({
  server: {
    host: "10.0.7.117",
    port: 5000,
    allowedHosts: true,
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path,
        ws: true,
      },
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(
    Boolean,
  ),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom", "react-router-dom"],
          "ui-vendor": [
            "lucide-react",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
          ],
          "query-vendor": ["@tanstack/react-query"],
          utils: ["clsx", "class-variance-authority"],
        },
      },
    },
    sourcemap: mode === "development",
    minify: "esbuild",
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
  },
  esbuild: {
    drop: mode === "production" ? ["console", "debugger"] : [],
  },
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
  },
}));
