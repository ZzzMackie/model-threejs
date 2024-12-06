import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src')
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, 'src/main.js'),
      name: 'threeModel-render',
      // the proper extensions will be added
      fileName: 'threeModelRender'
    },
    rollupOptions: {
      cache: true
    }
  },
  plugins: [vue()]
});
