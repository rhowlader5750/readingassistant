import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        sidebar: resolve(__dirname, 'src/sidebar.jsx'),
      },
      output: {
        entryFileNames: 'sidebar.js',
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
});
