import { defineConfig } from 'vite'
import path from 'path'

module.exports = defineConfig({
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    }
  },
  server: {
    host: 'localhost',
    watch: {
      usePolling: true
    }
  }
})
