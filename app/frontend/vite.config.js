import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Vite config: no special server settings; build output handled by script
export default defineConfig({
  plugins: [react()],
  base: './',
})
