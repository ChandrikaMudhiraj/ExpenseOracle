import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: no special server settings; build output handled by script
export default defineConfig({
  plugins: [react()],
  base: '/static/',
  server: {
    proxy: {
      '/auth': 'http://localhost:8000',
      '/expenses': 'http://localhost:8000',
      '/budgets': 'http://localhost:8000',
      '/ml': 'http://localhost:8000',
      '/goals': 'http://localhost:8000',
      '/dashboard': 'http://localhost:8000',
    }
  }
})
