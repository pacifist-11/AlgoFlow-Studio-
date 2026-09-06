import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import fs from 'fs'

function generateSwPrecache() {
  return {
    name: 'generate-sw-precache',
    closeBundle() {
      const distDir = resolve(__dirname, 'dist')
      const swPath = resolve(distDir, 'sw.js')
      if (!fs.existsSync(distDir) || !fs.existsSync(swPath)) return

      const getFiles = (dir) => {
        let results = []
        const list = fs.readdirSync(dir)
        list.forEach((file) => {
          const filePath = resolve(dir, file)
          const stat = fs.statSync(filePath)
          if (stat && stat.isDirectory()) {
            results = results.concat(getFiles(filePath))
          } else {
            const relativePath = '/' + filePath.replace(distDir, '').replace(/\\/g, '/').replace(/^\//, '')
            if (!relativePath.endsWith('sw.js') && !relativePath.endsWith('.map')) {
              results.push(relativePath)
            }
          }
        })
        return results
      }

      const allAssets = Array.from(new Set(['/', '/index.html', ...getFiles(distDir)]))
      let swContent = fs.readFileSync(swPath, 'utf-8')
      const assetsJson = JSON.stringify(allAssets, null, 2)

      swContent = swContent.replace(
        /const ASSETS = \[[\s\S]*?\];/,
        `const ASSETS = ${assetsJson};`
      )

      fs.writeFileSync(swPath, swContent, 'utf-8')
      console.log(`[sw-precache] Injected ${allAssets.length} assets into dist/sw.js for full offline caching!`)
    }
  }
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  publicDir: resolve(__dirname, 'src', 'public'),
  plugins: [react(), generateSwPrecache()],
  define: {
    'process.env': {}
  },
  server: {
    port: 1912,
    open: true
  }
})

