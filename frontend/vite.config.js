import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Match Google Maps HTTP referrer http://127.0.0.1:5173/* (localhost ≠ 127.0.0.1).
    host: "127.0.0.1",
    port: 5173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/test/setup.js',
    env: { VITE_BACKEND_URL: 'http://test-api' },
  },
})
