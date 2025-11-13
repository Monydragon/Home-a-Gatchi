import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@core': resolve(__dirname, './src/core'),
      '@entities': resolve(__dirname, './src/entities'),
      '@systems': resolve(__dirname, './src/systems'),
      '@world': resolve(__dirname, './src/world'),
      '@ui': resolve(__dirname, './src/ui'),
      '@config': resolve(__dirname, './src/config'),
      '@scenes': resolve(__dirname, './src/scenes'),
      '@utils': resolve(__dirname, './src/utils'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: true,
  },
});

