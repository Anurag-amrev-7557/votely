import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      // Revert to default esbuild behavior which is faster
      fastRefresh: true
    }),

    // Enable compression for production builds
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      deleteOriginalAssets: false,
      threshold: 1024,
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      deleteOriginalAssets: false,
      threshold: 1024,
    }),

    // Visualize bundle size - configured to write to stats.html but not open by default
    visualizer({
      filename: 'dist/stats.html',
      open: false,
      gzipSize: true,
      brotliSize: true,
      template: 'treemap',
    }),

    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'favicon.ico', 'robots.txt', 'apple-touch-icon.png'],
      manifest: {
        name: 'Votely',
        short_name: 'Votely',
        description: 'Secure, modern online voting platform',
        theme_color: '#2563eb',
        background_color: '#ffffff',
        display: 'standalone',
        start_url: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webp}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-stylesheets',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-webfonts',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  server: {
    port: 5173,
    proxy: {
      '/api/': {
        target: 'http://localhost:5001',
        changeOrigin: true,
        secure: false
      }
    },
    // Enable HMR
    hmr: {
      overlay: true,
      protocol: 'ws',
    },
    // Optimize development server
    watch: {
      usePolling: true,
      interval: 100,
    },
    // Enable compression
    compress: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    fs: {
      strict: true,
      allow: ['..'],
    },
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@context': resolve(__dirname, 'src/context'),
      '@assets': resolve(__dirname, 'src/assets'),
      '@utils': resolve(__dirname, 'src/utils'),
      // Fix duplicate React issue - ensure single React instance
      'react': resolve(__dirname, 'node_modules/react'),
      'react-dom': resolve(__dirname, 'node_modules/react-dom'),
    },
    dedupe: ['react', 'react-dom'],
  },
  css: {
    postcss: './postcss.config.js',
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    devSourcemap: true,
    preprocessorOptions: {
      scss: {
        additionalData: `@import "./src/styles/variables.scss";`
      }
    }
  },
  build: {
    target: 'esnext',
    minify: 'terser',
    sourcemap: true,
    chunkSizeWarningLimit: 1000,
    cssCodeSplit: true,
    rollupOptions: {
      output: {
        // Simplified manual chunks strategy to prevent React loading race conditions
        manualChunks: {
          // React must be in its own chunk that loads first
          'react-vendor': ['react', 'react-dom', 'react/jsx-runtime', 'react/jsx-dev-runtime'],
          // Router depends on React, so it's separate
          'router-vendor': ['react-router-dom'],
          // UI libraries
          'ui-vendor': ['framer-motion', '@headlessui/react', 'lucide-react'],
          // Utilities
          'utils-vendor': ['axios', 'date-fns', 'lodash'],
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
      },
    },
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 2, // Reduced from 5 to 2 to improve build speed with minimal size impact
      },
      mangle: {
        safari10: true,
      },
    },
    assetsInlineLimit: 4096,
    cssMinify: true,
    reportCompressedSize: false,
    modulePreload: {
      polyfill: true,
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
      'react-router-dom',
      '@headlessui/react',
      '@heroicons/react',
      'axios',
      'date-fns',
      'framer-motion',
      'react-hot-toast',
      'react-error-boundary',
      '@react-three/fiber',
      '@react-three/drei',
      'three',
    ],
    exclude: ['@vitejs/plugin-react'],
    force: true,
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true,
      },
      treeShaking: true,
    },
  },
  cacheDir: '.vite_cache',
  esbuild: {
    target: 'esnext',
    supported: {
      'top-level-await': true
    },
    legalComments: 'none',
  },
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    cors: true,
  },
})
