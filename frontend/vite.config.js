import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/analyze-message': 'http://localhost:8000',
      '/analyze-url': 'http://localhost:8000',
      '/analyze-voice': 'http://localhost:8000',
      '/translate': 'http://localhost:8000',
      '/history': 'http://localhost:8000',
      '/analytics': 'http://localhost:8000',
      '/auth': 'http://localhost:8000'
    }
  }
})
