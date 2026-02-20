import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, ".", "");
  const proxyTarget = env.VITE_API_PROXY_TARGET || env.VITE_API_BASE || "";
  const proxy =
    proxyTarget && proxyTarget.startsWith("http")
      ? {
          "/api": {
            target: proxyTarget,
            changeOrigin: true,
            rewrite: (pathValue: string) => pathValue.replace(/^\/api/, ""),
          },
        }
      : undefined;

  return {
    plugins: [react()],
    resolve: {
      alias: {
        "@": "/src",
        "react-router-dom": "/src/lib/react-router-dom.tsx",
      },
    },
    server: proxy ? { proxy } : undefined,
  };
});
