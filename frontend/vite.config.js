import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ isSsrBuild }) => ({
  plugins: [react()],
  build: {
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: isSsrBuild ? undefined : {
          // Split vendor libraries into separate chunks
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['react-helmet-async', 'react-icons'],
        }
      }
    },
    // Increase chunk warning limit since we're now splitting
    chunkSizeWarningLimit: 300,
  },
  server: {
    host: true,
    proxy: {
      '/api': 'http://localhost:8000',
      '/media': 'http://localhost:8000',
    }
  },
  ssr: {
    noExternal: ['react-helmet-async']
  }
}))
