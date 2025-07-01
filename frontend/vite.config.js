import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { compression } from 'vite-plugin-compression2'
import { visualizer } from 'rollup-plugin-visualizer'
import { splitVendorChunkPlugin } from 'vite'
import { resolve } from 'path'
import { VitePWA } from 'vite-plugin-pwa'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ['@babel/plugin-transform-runtime', { 
            regenerator: true,
            helpers: true,
            useESModules: true
          }],
          ['@babel/plugin-transform-react-jsx', { 
            runtime: 'automatic',
            throwIfNamespace: false
          }]
        ],
        // Add babel optimization options
        compact: true,
        minified: true,
        comments: false
      },
      // Enable Fast Refresh at the plugin level
      fastRefresh: true
    }),
    // Split vendor chunks for better caching
    splitVendorChunkPlugin(),
    // Enable compression for production builds
    compression({
      algorithm: 'gzip',
      exclude: [/\.(br)$/, /\.(gz)$/],
      deleteOriginalAssets: false,
      threshold: 1024, // Only compress files larger than 1KB
    }),
    compression({
      algorithm: 'brotliCompress',
      exclude: [/\.(br)$/, /\.(gz)$/],
      deleteOriginalAssets: false,
      threshold: 1024,
    }),
    // Visualize bundle size
    visualizer({
      filename: 'dist/stats.html',
      open: true,
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
      '/api': {
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
    // Optimize middleware
    middlewareMode: false,
    // Enable CORS
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    // Optimize dev server
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
    },
  },
  css: {
    postcss: './postcss.config.js',
    // Enable CSS code splitting
    modules: {
      localsConvention: 'camelCase',
      generateScopedName: '[name]__[local]___[hash:base64:5]'
    },
    // Optimize CSS
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
    sourcemap: false, // Disable sourcemaps in production
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize rollup options
    rollupOptions: {
      output: {
        // Optimize chunk splitting with better granularity
        manualChunks: (id) => {
          if (id.includes('node_modules/react/')) {
            if (id.includes('/hooks/')) return 'react-hooks';
            if (id.includes('/jsx-runtime')) return 'react-jsx';
            if (id.includes('/scheduler')) return 'react-scheduler';
            return 'react-core';
          }
          if (id.includes('node_modules/react-dom/')) {
            if (id.includes('/client/')) return 'react-dom-client';
            if (id.includes('/server/')) return 'react-dom-server';
            return 'react-dom';
          }
          if (id.includes('node_modules/react-router-dom/')) {
            if (id.includes('/hooks')) return 'router-hooks';
            if (id.includes('/components')) return 'router-components';
            if (id.includes('/utils')) return 'router-utils';
            return 'router-core';
          }
          if (id.includes('node_modules/framer-motion/')) return 'vendor-framer-motion';
          if (id.includes('node_modules/@headlessui/')) return 'vendor-headlessui';
          if (id.includes('node_modules/@heroicons/')) return 'vendor-heroicons';
          if (id.includes('node_modules/axios/')) return 'vendor-axios';
          if (id.includes('node_modules/date-fns/')) return 'vendor-date-fns';
          if (id.includes('node_modules/lodash')) return 'vendor-lodash';
          if (id.includes('node_modules/zod')) return 'vendor-zod';
          if (id.includes('node_modules/react-hot-toast')) return 'vendor-toast';
          if (id.includes('node_modules/react-error-boundary')) return 'vendor-error-boundary';
          if (id.includes('src/index.css')) return 'styles-main';
          if (id.includes('src/styles/')) return 'styles-modules';
          if (id.includes('src/components/admin/')) return 'admin';
          if (id.includes('src/pages/landing/')) return 'landing';
          if (id.includes('node_modules/')) return 'vendor-other';
        },
        // Optimize chunk loading with better naming
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || 'chunk';
          return `assets/js/${name}-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]',
        // Optimize code splitting
        experimentalMinChunkSize: 10000,
      },
    },
    // Optimize terser options
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug', 'console.warn'],
        passes: 5,
        dead_code: true,
        unsafe: true,
        unsafe_arrows: true,
        unsafe_comps: true,
        unsafe_Function: true,
        unsafe_math: true,
        unsafe_methods: true,
        unsafe_proto: true,
        unsafe_regexp: true,
        unsafe_undefined: true,
        sequences: true,
        booleans: true,
        loops: true,
        unused: true,
        if_return: true,
        join_vars: true,
        collapse_vars: true,
        reduce_vars: true,
        hoist_funs: true,
        hoist_vars: true,
        properties: true,
        keep_fargs: false,
        keep_infinity: true,
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
          reserved: ['__esModule'],
        },
        toplevel: true,
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
        braces: false,
        semicolons: true,
      },
    },
    // Enable build optimization
    assetsInlineLimit: 4096,
    cssMinify: true,
    reportCompressedSize: false,
    // Optimize module loading
    modulePreload: {
      polyfill: true,
    },
  },
  optimizeDeps: {
    // Pre-bundle dependencies
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@headlessui/react',
      '@heroicons/react',
      'axios',
      'date-fns',
      'framer-motion',
    ],
    // Exclude dependencies that should not be pre-bundled
    exclude: ['@vitejs/plugin-react'],
    // Optimize dependency pre-bundling
    esbuildOptions: {
      target: 'esnext',
      supported: {
        'top-level-await': true,
      },
      treeShaking: true,
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true,
    },
  },
  // Enable caching
  cacheDir: '.vite_cache',
  // Enable esbuild optimization
  esbuild: {
    jsxInject: undefined,
    jsxFactory: 'React.createElement',
    jsxFragment: 'React.Fragment',
    target: 'esnext',
    supported: {
      'top-level-await': true
    },
    // Optimize esbuild options
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    legalComments: 'none',
  },
  // Optimize preview server
  preview: {
    port: 4173,
    strictPort: true,
    host: true,
    https: false,
    open: true,
    cors: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
  },
})
