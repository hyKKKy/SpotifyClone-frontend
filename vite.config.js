import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        changeOrigin: true,
        secure: false,
        target: 'https://localhost:7243',
      },
      '/storage': {
        changeOrigin: true,
        secure: false,
        target: 'https://localhost:7243',
      },
      '/uploads': {
        changeOrigin: true,
        secure: false,
        target: 'https://localhost:7243',
      },
    },
  },
})
