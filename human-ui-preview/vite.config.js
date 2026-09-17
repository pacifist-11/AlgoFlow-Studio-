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

import dotenv from 'dotenv'
dotenv.config()
dotenv.config({ path: '.env.local' })

function apiDevServerPlugin() {
  return {
    name: 'api-dev-server',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url.startsWith('/api/auth/')) {
          return next();
        }

        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (data) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(data));
          return res;
        };

        if (req.url.startsWith('/api/auth/config')) {
          try {
            const mod = await import('./api/auth/config.js');
            return mod.default(req, res);
          } catch (e) {
            return res.status(500).json({ error: e.message });
          }
        }

        if (req.url.startsWith('/api/auth/google')) {
          const run = async (bodyObj = {}) => {
            req.body = bodyObj;
            const mod = await import('./api/auth/google.js');
            return mod.default(req, res);
          };

          if (req.method === 'GET' || req.method === 'OPTIONS') {
            return run({});
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              await run(parsed);
            } catch (e) {
              return res.status(500).json({ error: e.message });
            }
          });
          return;
        }

        if (req.url.startsWith('/api/auth/otp')) {
          const run = async (bodyObj = {}) => {
            req.body = bodyObj;
            const mod = await import('./api/auth/otp.js');
            return mod.default(req, res);
          };

          if (req.method === 'GET' || req.method === 'OPTIONS') {
            return run({});
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              await run(parsed);
            } catch (e) {
              return res.status(500).json({ error: e.message });
            }
          });
          return;
        }

        if (req.url.startsWith('/api/auth/deactivate')) {
          const run = async (bodyObj = {}) => {
            req.body = bodyObj;
            const mod = await import('./api/auth/deactivate.js');
            return mod.default(req, res);
          };

          if (req.method === 'GET' || req.method === 'OPTIONS') {
            return run({});
          }

          let body = '';
          req.on('data', chunk => { body += chunk; });
          req.on('end', async () => {
            try {
              const parsed = body ? JSON.parse(body) : {};
              await run(parsed);
            } catch (e) {
              return res.status(500).json({ error: e.message });
            }
          });
          return;
        }

        next();
      });
    }
  };
}

// https://vite.dev/config/
export default defineConfig({
  base: '/',
  publicDir: resolve(__dirname, 'src', 'public'),
  plugins: [react(), generateSwPrecache(), apiDevServerPlugin()],
  define: {
    'process.env': {}
  },
  server: {
    port: 5173,
    open: true
  }
})

