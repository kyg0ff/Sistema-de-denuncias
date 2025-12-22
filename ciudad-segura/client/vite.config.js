// client/vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  
  // Proxy solo en desarrollo (para evitar CORS localmente)
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },

  // Opcional pero recomendado: asegura que los assets se sirvan correctamente
  base: '/', 

  build: {
    outDir: 'dist',
    sourcemap: false, // puedes poner true si quieres debug en prod
  },
})