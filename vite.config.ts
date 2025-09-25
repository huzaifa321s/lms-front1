import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import terser from '@rollup/plugin-terser';
import path from 'path';

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    terser(), 
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
 
      '@tabler/icons-react': '@tabler/icons-react/dist/esm/icons/index.mjs',
    },
  },
  define: {
    // Only include if explicitly needed; Vite already exposes process.env
    'process.env': process.env,
  },
  build: {
    assetsInlineLimit: 0, // Inline assets disable kiya for better control
    minify: 'terser',
    terserOptions: {
      compress: { drop_console: true }, // Remove console.logs
      mangle: true, // Shorten variable names
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: [
            'react',
            'react-dom',
            '@tanstack/react-query',
            '@tanstack/react-router',
            'axios',
            '@reduxjs/toolkit',
          ],
          icons: ['@tabler/icons-react', 'lucide-react'], // Heavy icon libraries
        },
      },
    },
  },
  server: {
    headers: {
      // Apply Cache-Control only to static assets
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
  preview: {
    headers: {
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  },
});