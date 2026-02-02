import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"
import { inspectAttr } from 'kimi-plugin-inspect-react'

// https://vite.dev/config/
export default defineConfig({
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
        rewrite: (path) => path.replace(/^\/api\/coc/, ''),
        configure: (proxy) => {
          proxy.on('proxyReq', (proxyReq) => {
            // Add the API token from environment variable
            const token = process.env.VITE_COC_API_TOKEN || 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiIsImtpZCI6IjI4YTMxOGY3LTAwMDAtYTFlYi03ZmExLTJjNzQzM2M2Y2NhNSJ9.eyJpc3MiOiJzdXBlcmNlbGwiLCJhdWQiOiJzdXBlcmNlbGw6Z2FtZWFwaSIsImp0aSI6IjM1NzBmZGQxLTFiYjUtNDVmZi1hYzQ1LWU0NGExYmRiMTYxOCIsImlhdCI6MTc3MDAxODAwNCwic3ViIjoiZGV2ZWxvcGVyLzBlZWNmY2JlLWQwN2UtZWUyMS03ZmYxLWE0YTYzYzRkNTJiZSIsInNjb3BlcyI6WyJjbGFzaCJdLCJsaW1pdHMiOlt7InRpZXIiOiJkZXZlbG9wZXIvc2lsdmVyIiwidHlwZSI6InRocm90dGxpbmcifSx7ImNpZHJzIjpbIjQzLjI0MC45LjUiXSwidHlwZSI6ImNsaWVudCJ9XX0.7qnGXOUNVRQlrLbq_HkjwqjZuvxidHsM5Q2xOOv-btdB80_fjMXpUqSXPI9DAnIpAfVJYzP2QY8PFK5RsZnOcA';
            proxyReq.setHeader('Authorization', `Bearer ${token}`);
          });
        },
      },
    },
  },
});
