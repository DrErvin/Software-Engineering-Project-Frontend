import { defineConfig } from 'vite';

export default defineConfig({
  root: 'src',
  server: {
    port: 8080,
    cors: true,
  },
  build: {
    outDir: '../dist',
  },
  publicDir: '../public',
});
