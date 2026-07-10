import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

// https://vite.dev/config/
export default defineConfig({
  root: resolve(__dirname, 'src'),
  publicDir: resolve(__dirname, 'src', 'public'),
  base: './',
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
  },
  plugins: [react()],
  define: {
    'process.env': {}
  },
  server: {
    port: 9988,
    open: true,
    // No local proxy — API calls go through Vercel serverless functions
    // Use `vercel dev` to run API routes locally
  }
})
