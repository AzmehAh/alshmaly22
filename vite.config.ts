import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          ui: ['lucide-react', 'framer-motion']
        }
      }
    },
    sourcemap: false,
    minify: 'terser',
    cssCodeSplit: true
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});
