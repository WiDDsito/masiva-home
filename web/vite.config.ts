import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { wooCartSimulator } from './dev/wooCartSimulator'

export default defineConfig({
  plugins: [react(), wooCartSimulator()],
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/wp-json/wc/store/v1/products': {
        target: 'https://masivahome.com',
        changeOrigin: true,
      },
    },
  },
})
