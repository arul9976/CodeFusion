import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: '0.0.0.0',
    port: 3001,
    cors: {
      origin: 'http://localhost:8080',
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true,
        ws: true,
      },
      '/CodeFusion_war': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/CodeFusion_war/, ''),
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
