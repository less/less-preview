import * as path from "path";
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: 'less-preview',
  build: {
    outDir: "docs",
    assetsInlineLimit: 0,
    emptyOutDir: false,
    rollupOptions: {
      output: {
        assetFileNames: `assets/[name].[ext]`
      }
    }
  },
  plugins: [vue({
    reactivityTransform: true
  })],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
      "@components": path.resolve(__dirname, "src/components"),
    }
  }
})
