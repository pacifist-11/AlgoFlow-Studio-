import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  publicDir: resolve(__dirname, 'src', 'public'),
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    port: 9988,
    open: true
  }
})
