import vue from "@vitejs/plugin-vue";
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from "path";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      "~": path.resolve(__dirname, "/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8083,
  },
});
