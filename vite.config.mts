import { defineConfig } from "vite";
import zaloMiniApp from "zmp-vite-plugin";
import react from "@vitejs/plugin-react";

export default () => {
  return defineConfig({
    root: "./src",
    base: "",
    plugins: [zaloMiniApp(), react()],

    server: {
      proxy: {
        "/api": {
          target: "https://crmlenderapi.tima.vn",
          changeOrigin: true,
          secure: false,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },

    build: {
      assetsInlineLimit: 0,
    },

    resolve: {
      alias: {
        "@": "/src",
      },
    },
  });
};