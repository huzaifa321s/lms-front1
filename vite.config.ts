import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import tailwindcss from '@tailwindcss/vite';
import { TanStackRouterVite } from '@tanstack/router-plugin/vite';
import terser from '@rollup/plugin-terser';
import path from 'path';
import viteCompression from 'vite-plugin-compression'
import { imagetools } from 'vite-imagetools'

export default defineConfig({
  plugins: [
    TanStackRouterVite({
      target: 'react',
      autoCodeSplitting: true,
    }),
    react(),
    tailwindcss(),
    terser(), 
    viteCompression(),
    imagetools()
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
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.info','console.debug'] // remove specific calls
      },
      mangle: {
        toplevel: true
      },
      format: {
        comments: false,
      }
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