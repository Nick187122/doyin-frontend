import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Mirrors the production Vercel rewrite so local dev hits the live backend.
      '/api': {
        target: 'https://doyin-backend.onrender.com',
        changeOrigin: true,
      },
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('react-router-dom') || id.includes('react-dom') || id.includes(`${'node_modules'}/react/`)) {
            return 'react';
          }

          if (id.includes('recharts')) {
            return 'charts';
          }

          if (id.includes('lucide-react')) {
            return 'ui';
          }
        },
      },
    },
  },
})
