import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(async () => {
  const plugins = [react()];
  
  if (process.env.NODE_ENV !== "production" && process.env.REPL_ID !== undefined) {
    const [
      { default: runtimeErrorOverlay },
      { cartographer },
      { devBanner },
    ] = await Promise.all([
      import("@replit/vite-plugin-runtime-error-modal"),
      import("@replit/vite-plugin-cartographer"),
      import("@replit/vite-plugin-dev-banner"),
    ]);
    plugins.push(runtimeErrorOverlay(), cartographer(), devBanner());
  }
  
  // Base path for GitHub Pages (set via BASE_PATH env var, defaults to root)
  const base = process.env.BASE_PATH || '/';
  
  return {
    base,
    plugins,
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "client", "src"),
        "@shared": path.resolve(__dirname, "shared"),
        "@assets": path.resolve(__dirname, "attached_assets"),
      },
    },
    root: path.resolve(__dirname, "client"),
    build: {
      outDir: path.resolve(__dirname, "dist"),
      emptyOutDir: true,
    },
    server: {
      fs: {
        strict: true,
        deny: ["**/.*"],
      },
    },
  };
});
