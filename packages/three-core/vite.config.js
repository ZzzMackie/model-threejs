import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import { terser } from 'rollup-plugin-terser';
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './')
    }
  },
  build: {
    lib: {
      // Could also be a dictionary or array of multiple entry points
      entry: resolve(__dirname, './main.js'),
      name: 'threeModel-core',
      // the proper extensions will be added
      fileName: 'threeModel-core'
    },
    rollupOptions: {
      cache: true,
      plugins: [
        terser({
          compress: {
            drop_console: true
          }
        })
      ]
    }
  },
  plugins: [vue()]
});
