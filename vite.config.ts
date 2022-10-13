import vue from "@vitejs/plugin-vue";
// eslint-disable-next-line unicorn/prefer-node-protocol
import path from "path";
import { defineConfig, loadEnv } from "vite";
import envCompatible from 'vite-plugin-env-compatible'

export default defineConfig({
  plugins: [vue(),envCompatible(/* options */)],
  resolve: {
    alias: {
      // eslint-disable-next-line unicorn/prefer-module
      "~": path.resolve(__dirname, "/src"),
    },
  },
  server: {
    host: "0.0.0.0",
    port: 8083,
    proxy: {
      '/api': {
        target: 'http://tms-test-server.p-e.kr:8081',
        changeOrigin: true,
        secure: false,
        ws: true
      }
    }
  }
  
});
