import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Igual que el ejemplo de la cátedra: el front corre en el puerto 3000
// y las llamadas a /recepcion-bolsin se redirigen al backend Spring Boot (8080).
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/recepcion-bolsin': {
        target: 'http://localhost:8080',
        changeOrigin: true
      }
    }
  }
})
