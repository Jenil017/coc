import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig, loadEnv } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '')

  return {
    base: './',
    plugins: [inspectAttr(), react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
    server: {
      proxy: {
        '/api/coc': {
          target: 'https://api.clashofclans.com/v1',
          changeOrigin: true,
          rewrite: (path) => {
            // Extract 'path' query parameter: /api/coc?path=clans/%23TAG
            const match = path.match(/[?&]path=([^&]*)/);
            if (match && match[1]) {
              // Decode and return just the API path
              return `/${decodeURIComponent(match[1])}`;
            }
            return '/'; // Fallback
          },
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              const token = env.COC_API_TOKEN;
              if (token) {
                proxyReq.setHeader('Authorization', `Bearer ${token}`);
              } else {
                console.error('[Vite Proxy] COC_API_TOKEN not found in environment');
              }
            });
          },
        },
      },
    },
  };
});
