import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', 
    port: 3001,    
    cors: {
      origin: 'http://localhost:3001',
      methods: ['GET', 'POST'],   
      allowedHeaders: ['Content-Type', 'Authorization'], 
    },
    proxy: {
      '/socket.io': {
        target: 'http://localhost:3000',
        changeOrigin: true, 
        ws: true,      
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
