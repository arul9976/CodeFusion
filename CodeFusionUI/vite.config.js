import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // To expose it to your network
    port: 3001,       // Default port or custom port
    cors: {
      origin: 'http://localhost:3001', // Allow this origin to make requests
      methods: ['GET', 'POST'],       // Allow these methods
      allowedHeaders: ['Content-Type', 'Authorization'], // Optional headers
    },
    proxy: {
      '/socket.io': {
        target: 'http://172.17.22.225:3000',
        changeOrigin: true, // Ensures the request appears to come from the proxy server
        ws: true,           // Enable WebSocket proxying
      },
    }
  },
  resolve: {
    alias: {
      'ace-builds': 'ace-builds',
    },
  },
  optimizeDeps: {
    include: ['ace-builds'],
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'ace-builds': ['ace-builds'],
        },
      },
    },
  },

})
