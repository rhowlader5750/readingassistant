import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        sidebar: 'src/sidebar.jsx', // <- or .tsx
      },
      output: {
        entryFileNames: 'sidebar.js'
      }
    }
  }
});
