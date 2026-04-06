import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
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
