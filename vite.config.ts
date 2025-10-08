import path from 'path'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import terser from '@rollup/plugin-terser'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import { visualizer } from 'rollup-plugin-visualizer'
import { imagetools } from 'vite-imagetools'
import viteCompression from 'vite-plugin-compression'
import { createHtmlPlugin } from 'vite-plugin-html'
import viteImagemin from 'vite-plugin-imagemin'
import webfontDownload from 'vite-plugin-webfont-dl'

export default defineConfig(({ command }) => {
  return {
    plugins: [
      TanStackRouterVite({
        target: 'react',
        autoCodeSplitting: true,
      }),
      react(),
      webfontDownload([
        'https://fonts.googleapis.com/css2?family=Inter:wght@100..900&display=swap',
        'https://fonts.googleapis.com/css2?family=Manrope:wght@200..800&display=swap',
      ]),

      tailwindcss(),
      createHtmlPlugin({
        inject: {
          tags: [
            {
              tag: 'link',
              attrs: {
                rel: 'preload',
                href: './src/index.css',
                as: 'style',
              },
              injectTo: 'head',
            },
          ],
        },
      }),
      terser(),
      
      viteCompression({ algorithm: 'brotliCompress' }),
      imagetools(),

      ...(command === 'build'
        ? [
            viteImagemin({
              gifsicle: { optimizationLevel: 7, interlaced: false },
              optipng: { optimizationLevel: 7 },
              mozjpeg: { quality: 80 },
              pngquant: { quality: [0.7, 0.9], speed: 4 },
              svgo: {
                plugins: [
                  { name: 'removeViewBox' },
                  { name: 'removeEmptyAttrs', active: false },
                ],
              },
              webp: { quality: 80 },
              avif: { quality: 50 },
            }),
            visualizer({
              open: true,
              filename: 'bundle-report.html',
              gzipSize: true,
              brotliSize: true,
            }),
          ]
        : []),
    ],
optimizeDeps: {
  include: ["@tinymce/tinymce-react"], 
},

    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },

    define: {
      'process.env': process.env,
    },

    build: {
      assetsInlineLimit: 0,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.info', 'console.debug'],
        },
        mangle: { toplevel: true },
        format: { comments: false },
      },
      rollupOptions: {
        output: {
     manualChunks: {
          // 🔹 Core React
          react: ["react", "react-dom"],

          // 🔹 UI + Icons (Radix + Lucide + Shadcn)
          ui: [
            "@radix-ui/react-accordion",
            "@radix-ui/react-avatar",
            "@radix-ui/react-collapsible",
            "@radix-ui/react-dialog",
            "@radix-ui/react-dropdown-menu",
            "@radix-ui/react-icons",
            "@radix-ui/react-label",
            "@radix-ui/react-navigation-menu",
            "@radix-ui/react-popover",
            "@radix-ui/react-progress",
            "@radix-ui/react-scroll-area",
            "@radix-ui/react-select",
            "@radix-ui/react-separator",
            "@radix-ui/react-slot",
            "@radix-ui/react-tabs",
            "@radix-ui/react-tooltip",
            "lucide-react"
          ],

          // 🔹 Forms & Validation
          forms: [
            "react-hook-form",
            "@hookform/resolvers",
            "zod",
            "react-phone-number-input"
          ],

          // 🔹 Charts & Visualization
          charts: [
            "recharts",
          ],

          // 🔹 State Management
          state: ["react-redux", "@reduxjs/toolkit"],

          // 🔹 Utils & Helpers
          utils: [
            "date-fns",
            "axios",
            "clsx",
            "js-cookie",
            "sonner",
            "use-debounce"
          ],

          // 🔹 Editors
          editor: ["@tinymce/tinymce-react"],


          // 🔹 Animations
          motion: ["motion", "react-confetti", "react-countup"],

          // 🔹 Other big libs
          swiper: ["swiper"],
        }
        },
      },
    },

    server: {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
    preview: {
      headers: {
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    },
  }
})
