import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],

  build: {
    // ── Target modern browsers — smaller output ──────────────────────────
    target: 'es2020',

    // ── CSS code splitting — one file for better caching ─────────────────
    cssCodeSplit: false,

    // ── Minification ──────────────────────────────────────────────────────
    minify: 'esbuild',

    rollupOptions: {
      output: {
        // ── Manual chunk splitting for optimal long-term caching ──────────
        // React & react-dom rarely change → separate chunk with long cache TTL
        manualChunks: (id) => {
          if (id.includes('node_modules/react/') || id.includes('node_modules/react-dom/')) {
            return 'react-vendor';
          }
          if (id.includes('node_modules/lucide-react/')) {
            return 'icons';
          }
          // Everything else (app code) goes in the default chunk
        },

        // ── Predictable asset names for CDN caching ───────────────────────
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
})