import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',  // Make sure it points to the correct output directory
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'], // Split react and react-dom into a separate chunk
        },
      },
    },
  },
  server: {
    host: '0.0.0.0', // This makes Vite listen on all interfaces
    port: 5173,
  },
})
