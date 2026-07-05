import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

console.log('--- LOADING VITE CONFIG FROM FRONTEND_V2 ---');
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
  server: {
    port: 5173,
    strictPort: false,

    // ── CORS proxy for external platform APIs ───────────────────────────
    // Vite's proxy runs server-side so it bypasses browser CORS policies.
    proxy: {
      // GeeksForGeeks own internal practice API (used by the GFG website itself)
      '/api-proxy/gfg-practice': {
        target: 'https://practiceapi.geeksforgeeks.org',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api-proxy\/gfg-practice/, ''),
      },
      // GeeksForGeeks unofficial community stats API (fallback)
      '/api-proxy/gfg': {
        target: 'https://geeks-for-geeks-stats-api.vercel.app',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api-proxy\/gfg/, ''),
      },
      // HackerRank REST API
      '/api-proxy/hackerrank': {
        target: 'https://www.hackerrank.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api-proxy\/hackerrank/, ''),
      },
      // Codeforces official API (already CORS-enabled, proxy kept as fallback)
      '/api-proxy/codeforces': {
        target: 'https://codeforces.com',
        changeOrigin: true,
        secure: true,
        rewrite: (p) => p.replace(/^\/api-proxy\/codeforces/, ''),
      },
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
