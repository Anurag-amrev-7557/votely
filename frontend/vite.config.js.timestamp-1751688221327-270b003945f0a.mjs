// vite.config.js
import { defineConfig } from "file:///Users/anuragverma/Movies/votely/frontend/node_modules/vite/dist/node/index.js";
import react from "file:///Users/anuragverma/Movies/votely/frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import { compression } from "file:///Users/anuragverma/Movies/votely/frontend/node_modules/vite-plugin-compression2/dist/index.mjs";
import { visualizer } from "file:///Users/anuragverma/Movies/votely/frontend/node_modules/rollup-plugin-visualizer/dist/plugin/index.js";
import { splitVendorChunkPlugin } from "file:///Users/anuragverma/Movies/votely/frontend/node_modules/vite/dist/node/index.js";
import { resolve } from "path";
import { VitePWA } from "file:///Users/anuragverma/Movies/votely/frontend/node_modules/vite-plugin-pwa/dist/index.js";
var __vite_injected_original_dirname = "/Users/anuragverma/Movies/votely/frontend";
var vite_config_default = defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [
          ["@babel/plugin-transform-runtime", {
            regenerator: true,
            helpers: true,
            useESModules: true
          }],
          ["@babel/plugin-transform-react-jsx", {
            runtime: "automatic",
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
      algorithm: "gzip",
      exclude: [/\.(br)$/, /\.(gz)$/],
      deleteOriginalAssets: false,
      threshold: 1024
      // Only compress files larger than 1KB
    }),
    compression({
      algorithm: "brotliCompress",
      exclude: [/\.(br)$/, /\.(gz)$/],
      deleteOriginalAssets: false,
      threshold: 1024
    }),
    // Visualize bundle size
    visualizer({
      filename: "dist/stats.html",
      open: true,
      gzipSize: true,
      brotliSize: true,
      template: "treemap"
    }),
    VitePWA({
      registerType: "autoUpdate",
      includeAssets: ["favicon.svg", "favicon.ico", "robots.txt", "apple-touch-icon.png"],
      manifest: {
        name: "Votely",
        short_name: "Votely",
        description: "Secure, modern online voting platform",
        theme_color: "#2563eb",
        background_color: "#ffffff",
        display: "standalone",
        start_url: "/",
        icons: [
          {
            src: "/pwa-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png"
          },
          {
            src: "/pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable"
          }
        ]
      },
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg,webp}"],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-stylesheets",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          },
          {
            urlPattern: /^https:\/\/fonts\.gstatic\.com\/.*$/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts-webfonts",
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 }
            }
          }
        ]
      }
    })
  ],
  server: {
    port: 5173,
    proxy: {
      "/api": {
        target: "http://localhost:5001",
        changeOrigin: true,
        secure: false
      }
    },
    // Enable HMR
    hmr: {
      overlay: true,
      protocol: "ws"
    },
    // Optimize development server
    watch: {
      usePolling: true,
      interval: 100
    },
    // Enable compression
    compress: true,
    // Optimize middleware
    middlewareMode: false,
    // Enable CORS
    cors: true,
    headers: {
      "Access-Control-Allow-Origin": "*"
    },
    // Optimize dev server
    fs: {
      strict: true,
      allow: [".."]
    }
  },
  resolve: {
    alias: {
      "@": resolve(__vite_injected_original_dirname, "src"),
      "@components": resolve(__vite_injected_original_dirname, "src/components"),
      "@pages": resolve(__vite_injected_original_dirname, "src/pages"),
      "@context": resolve(__vite_injected_original_dirname, "src/context"),
      "@assets": resolve(__vite_injected_original_dirname, "src/assets"),
      "@utils": resolve(__vite_injected_original_dirname, "src/utils")
    }
  },
  css: {
    postcss: "./postcss.config.js",
    // Enable CSS code splitting
    modules: {
      localsConvention: "camelCase",
      generateScopedName: "[name]__[local]___[hash:base64:5]"
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
    target: "esnext",
    minify: "terser",
    sourcemap: false,
    // Disable sourcemaps in production
    // Optimize chunk size
    chunkSizeWarningLimit: 1e3,
    // Enable CSS code splitting
    cssCodeSplit: true,
    // Optimize rollup options
    rollupOptions: {
      output: {
        // Optimize chunk splitting with better granularity
        manualChunks: (id) => {
          if (id.includes("node_modules/")) return "vendor";
        },
        // Optimize chunk loading with better naming
        chunkFileNames: (chunkInfo) => {
          const name = chunkInfo.name || "chunk";
          return `assets/js/${name}-[hash].js`;
        },
        entryFileNames: "assets/js/[name]-[hash].js",
        assetFileNames: "assets/[ext]/[name]-[hash].[ext]",
        // Optimize code splitting
        experimentalMinChunkSize: 1e4
      }
    },
    // Optimize terser options
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
        pure_funcs: ["console.log", "console.info", "console.debug", "console.warn"],
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
        keep_infinity: true
      },
      mangle: {
        safari10: true,
        properties: {
          regex: /^_/,
          reserved: ["__esModule"]
        },
        toplevel: true
      },
      format: {
        comments: false,
        ascii_only: true,
        beautify: false,
        braces: false,
        semicolons: true
      }
    },
    // Enable build optimization
    assetsInlineLimit: 4096,
    cssMinify: true,
    reportCompressedSize: false,
    // Optimize module loading
    modulePreload: {
      polyfill: true
    }
  },
  optimizeDeps: {
    // Pre-bundle dependencies
    include: [
      "react",
      "react-dom",
      "react-router-dom",
      "@headlessui/react",
      "@heroicons/react",
      "axios",
      "date-fns",
      "framer-motion"
    ],
    // Exclude dependencies that should not be pre-bundled
    exclude: ["@vitejs/plugin-react"],
    // Optimize dependency pre-bundling
    esbuildOptions: {
      target: "esnext",
      supported: {
        "top-level-await": true
      },
      treeShaking: true,
      minify: true,
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true
    }
  },
  // Enable caching
  cacheDir: ".vite_cache",
  // Enable esbuild optimization
  esbuild: {
    jsxInject: void 0,
    jsxFactory: "React.createElement",
    jsxFragment: "React.Fragment",
    target: "esnext",
    supported: {
      "top-level-await": true
    },
    // Optimize esbuild options
    minify: true,
    minifyIdentifiers: true,
    minifySyntax: true,
    minifyWhitespace: true,
    treeShaking: true,
    legalComments: "none"
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
      "Access-Control-Allow-Origin": "*"
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCIvVXNlcnMvYW51cmFndmVybWEvTW92aWVzL3ZvdGVseS9mcm9udGVuZFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiL1VzZXJzL2FudXJhZ3Zlcm1hL01vdmllcy92b3RlbHkvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL1VzZXJzL2FudXJhZ3Zlcm1hL01vdmllcy92b3RlbHkvZnJvbnRlbmQvdml0ZS5jb25maWcuanNcIjtpbXBvcnQgeyBkZWZpbmVDb25maWcgfSBmcm9tICd2aXRlJ1xuaW1wb3J0IHJlYWN0IGZyb20gJ0B2aXRlanMvcGx1Z2luLXJlYWN0J1xuaW1wb3J0IHsgY29tcHJlc3Npb24gfSBmcm9tICd2aXRlLXBsdWdpbi1jb21wcmVzc2lvbjInXG5pbXBvcnQgeyB2aXN1YWxpemVyIH0gZnJvbSAncm9sbHVwLXBsdWdpbi12aXN1YWxpemVyJ1xuaW1wb3J0IHsgc3BsaXRWZW5kb3JDaHVua1BsdWdpbiB9IGZyb20gJ3ZpdGUnXG5pbXBvcnQgeyByZXNvbHZlIH0gZnJvbSAncGF0aCdcbmltcG9ydCB7IFZpdGVQV0EgfSBmcm9tICd2aXRlLXBsdWdpbi1wd2EnXG5cbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXG5leHBvcnQgZGVmYXVsdCBkZWZpbmVDb25maWcoe1xuICBwbHVnaW5zOiBbXG4gICAgcmVhY3Qoe1xuICAgICAgYmFiZWw6IHtcbiAgICAgICAgcGx1Z2luczogW1xuICAgICAgICAgIFsnQGJhYmVsL3BsdWdpbi10cmFuc2Zvcm0tcnVudGltZScsIHsgXG4gICAgICAgICAgICByZWdlbmVyYXRvcjogdHJ1ZSxcbiAgICAgICAgICAgIGhlbHBlcnM6IHRydWUsXG4gICAgICAgICAgICB1c2VFU01vZHVsZXM6IHRydWVcbiAgICAgICAgICB9XSxcbiAgICAgICAgICBbJ0BiYWJlbC9wbHVnaW4tdHJhbnNmb3JtLXJlYWN0LWpzeCcsIHsgXG4gICAgICAgICAgICBydW50aW1lOiAnYXV0b21hdGljJyxcbiAgICAgICAgICAgIHRocm93SWZOYW1lc3BhY2U6IGZhbHNlXG4gICAgICAgICAgfV1cbiAgICAgICAgXSxcbiAgICAgICAgLy8gQWRkIGJhYmVsIG9wdGltaXphdGlvbiBvcHRpb25zXG4gICAgICAgIGNvbXBhY3Q6IHRydWUsXG4gICAgICAgIG1pbmlmaWVkOiB0cnVlLFxuICAgICAgICBjb21tZW50czogZmFsc2VcbiAgICAgIH0sXG4gICAgICAvLyBFbmFibGUgRmFzdCBSZWZyZXNoIGF0IHRoZSBwbHVnaW4gbGV2ZWxcbiAgICAgIGZhc3RSZWZyZXNoOiB0cnVlXG4gICAgfSksXG4gICAgLy8gU3BsaXQgdmVuZG9yIGNodW5rcyBmb3IgYmV0dGVyIGNhY2hpbmdcbiAgICBzcGxpdFZlbmRvckNodW5rUGx1Z2luKCksXG4gICAgLy8gRW5hYmxlIGNvbXByZXNzaW9uIGZvciBwcm9kdWN0aW9uIGJ1aWxkc1xuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2d6aXAnLFxuICAgICAgZXhjbHVkZTogWy9cXC4oYnIpJC8sIC9cXC4oZ3opJC9dLFxuICAgICAgZGVsZXRlT3JpZ2luYWxBc3NldHM6IGZhbHNlLFxuICAgICAgdGhyZXNob2xkOiAxMDI0LCAvLyBPbmx5IGNvbXByZXNzIGZpbGVzIGxhcmdlciB0aGFuIDFLQlxuICAgIH0pLFxuICAgIGNvbXByZXNzaW9uKHtcbiAgICAgIGFsZ29yaXRobTogJ2Jyb3RsaUNvbXByZXNzJyxcbiAgICAgIGV4Y2x1ZGU6IFsvXFwuKGJyKSQvLCAvXFwuKGd6KSQvXSxcbiAgICAgIGRlbGV0ZU9yaWdpbmFsQXNzZXRzOiBmYWxzZSxcbiAgICAgIHRocmVzaG9sZDogMTAyNCxcbiAgICB9KSxcbiAgICAvLyBWaXN1YWxpemUgYnVuZGxlIHNpemVcbiAgICB2aXN1YWxpemVyKHtcbiAgICAgIGZpbGVuYW1lOiAnZGlzdC9zdGF0cy5odG1sJyxcbiAgICAgIG9wZW46IHRydWUsXG4gICAgICBnemlwU2l6ZTogdHJ1ZSxcbiAgICAgIGJyb3RsaVNpemU6IHRydWUsXG4gICAgICB0ZW1wbGF0ZTogJ3RyZWVtYXAnLFxuICAgIH0pLFxuICAgIFZpdGVQV0Eoe1xuICAgICAgcmVnaXN0ZXJUeXBlOiAnYXV0b1VwZGF0ZScsXG4gICAgICBpbmNsdWRlQXNzZXRzOiBbJ2Zhdmljb24uc3ZnJywgJ2Zhdmljb24uaWNvJywgJ3JvYm90cy50eHQnLCAnYXBwbGUtdG91Y2gtaWNvbi5wbmcnXSxcbiAgICAgIG1hbmlmZXN0OiB7XG4gICAgICAgIG5hbWU6ICdWb3RlbHknLFxuICAgICAgICBzaG9ydF9uYW1lOiAnVm90ZWx5JyxcbiAgICAgICAgZGVzY3JpcHRpb246ICdTZWN1cmUsIG1vZGVybiBvbmxpbmUgdm90aW5nIHBsYXRmb3JtJyxcbiAgICAgICAgdGhlbWVfY29sb3I6ICcjMjU2M2ViJyxcbiAgICAgICAgYmFja2dyb3VuZF9jb2xvcjogJyNmZmZmZmYnLFxuICAgICAgICBkaXNwbGF5OiAnc3RhbmRhbG9uZScsXG4gICAgICAgIHN0YXJ0X3VybDogJy8nLFxuICAgICAgICBpY29uczogW1xuICAgICAgICAgIHtcbiAgICAgICAgICAgIHNyYzogJy9wd2EtMTkyeDE5Mi5wbmcnLFxuICAgICAgICAgICAgc2l6ZXM6ICcxOTJ4MTkyJyxcbiAgICAgICAgICAgIHR5cGU6ICdpbWFnZS9wbmcnLFxuICAgICAgICAgIH0sXG4gICAgICAgICAge1xuICAgICAgICAgICAgc3JjOiAnL3B3YS01MTJ4NTEyLnBuZycsXG4gICAgICAgICAgICBzaXplczogJzUxMng1MTInLFxuICAgICAgICAgICAgdHlwZTogJ2ltYWdlL3BuZycsXG4gICAgICAgICAgfSxcbiAgICAgICAgICB7XG4gICAgICAgICAgICBzcmM6ICcvcHdhLTUxMng1MTIucG5nJyxcbiAgICAgICAgICAgIHNpemVzOiAnNTEyeDUxMicsXG4gICAgICAgICAgICB0eXBlOiAnaW1hZ2UvcG5nJyxcbiAgICAgICAgICAgIHB1cnBvc2U6ICdhbnkgbWFza2FibGUnLFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgICAgd29ya2JveDoge1xuICAgICAgICBnbG9iUGF0dGVybnM6IFsnKiovKi57anMsY3NzLGh0bWwsaWNvLHBuZyxzdmcsd2VicH0nXSxcbiAgICAgICAgcnVudGltZUNhY2hpbmc6IFtcbiAgICAgICAgICB7XG4gICAgICAgICAgICB1cmxQYXR0ZXJuOiAvXmh0dHBzOlxcL1xcL2ZvbnRzXFwuZ29vZ2xlYXBpc1xcLmNvbVxcLy4qJC8sXG4gICAgICAgICAgICBoYW5kbGVyOiAnQ2FjaGVGaXJzdCcsXG4gICAgICAgICAgICBvcHRpb25zOiB7XG4gICAgICAgICAgICAgIGNhY2hlTmFtZTogJ2dvb2dsZS1mb250cy1zdHlsZXNoZWV0cycsXG4gICAgICAgICAgICAgIGV4cGlyYXRpb246IHsgbWF4RW50cmllczogMTAsIG1heEFnZVNlY29uZHM6IDYwICogNjAgKiAyNCAqIDM2NSB9LFxuICAgICAgICAgICAgfSxcbiAgICAgICAgICB9LFxuICAgICAgICAgIHtcbiAgICAgICAgICAgIHVybFBhdHRlcm46IC9eaHR0cHM6XFwvXFwvZm9udHNcXC5nc3RhdGljXFwuY29tXFwvLiokLyxcbiAgICAgICAgICAgIGhhbmRsZXI6ICdDYWNoZUZpcnN0JyxcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcbiAgICAgICAgICAgICAgY2FjaGVOYW1lOiAnZ29vZ2xlLWZvbnRzLXdlYmZvbnRzJyxcbiAgICAgICAgICAgICAgZXhwaXJhdGlvbjogeyBtYXhFbnRyaWVzOiAxMCwgbWF4QWdlU2Vjb25kczogNjAgKiA2MCAqIDI0ICogMzY1IH0sXG4gICAgICAgICAgICB9LFxuICAgICAgICAgIH0sXG4gICAgICAgIF0sXG4gICAgICB9LFxuICAgIH0pLFxuICBdLFxuICBzZXJ2ZXI6IHtcbiAgICBwb3J0OiA1MTczLFxuICAgIHByb3h5OiB7XG4gICAgICAnL2FwaSc6IHtcbiAgICAgICAgdGFyZ2V0OiAnaHR0cDovL2xvY2FsaG9zdDo1MDAxJyxcbiAgICAgICAgY2hhbmdlT3JpZ2luOiB0cnVlLFxuICAgICAgICBzZWN1cmU6IGZhbHNlXG4gICAgICB9XG4gICAgfSxcbiAgICAvLyBFbmFibGUgSE1SXG4gICAgaG1yOiB7XG4gICAgICBvdmVybGF5OiB0cnVlLFxuICAgICAgcHJvdG9jb2w6ICd3cycsXG4gICAgfSxcbiAgICAvLyBPcHRpbWl6ZSBkZXZlbG9wbWVudCBzZXJ2ZXJcbiAgICB3YXRjaDoge1xuICAgICAgdXNlUG9sbGluZzogdHJ1ZSxcbiAgICAgIGludGVydmFsOiAxMDAsXG4gICAgfSxcbiAgICAvLyBFbmFibGUgY29tcHJlc3Npb25cbiAgICBjb21wcmVzczogdHJ1ZSxcbiAgICAvLyBPcHRpbWl6ZSBtaWRkbGV3YXJlXG4gICAgbWlkZGxld2FyZU1vZGU6IGZhbHNlLFxuICAgIC8vIEVuYWJsZSBDT1JTXG4gICAgY29yczogdHJ1ZSxcbiAgICBoZWFkZXJzOiB7XG4gICAgICAnQWNjZXNzLUNvbnRyb2wtQWxsb3ctT3JpZ2luJzogJyonLFxuICAgIH0sXG4gICAgLy8gT3B0aW1pemUgZGV2IHNlcnZlclxuICAgIGZzOiB7XG4gICAgICBzdHJpY3Q6IHRydWUsXG4gICAgICBhbGxvdzogWycuLiddLFxuICAgIH0sXG4gIH0sXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczoge1xuICAgICAgJ0AnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYycpLFxuICAgICAgJ0Bjb21wb25lbnRzJzogcmVzb2x2ZShfX2Rpcm5hbWUsICdzcmMvY29tcG9uZW50cycpLFxuICAgICAgJ0BwYWdlcyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3BhZ2VzJyksXG4gICAgICAnQGNvbnRleHQnOiByZXNvbHZlKF9fZGlybmFtZSwgJ3NyYy9jb250ZXh0JyksXG4gICAgICAnQGFzc2V0cyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL2Fzc2V0cycpLFxuICAgICAgJ0B1dGlscyc6IHJlc29sdmUoX19kaXJuYW1lLCAnc3JjL3V0aWxzJyksXG4gICAgfSxcbiAgfSxcbiAgY3NzOiB7XG4gICAgcG9zdGNzczogJy4vcG9zdGNzcy5jb25maWcuanMnLFxuICAgIC8vIEVuYWJsZSBDU1MgY29kZSBzcGxpdHRpbmdcbiAgICBtb2R1bGVzOiB7XG4gICAgICBsb2NhbHNDb252ZW50aW9uOiAnY2FtZWxDYXNlJyxcbiAgICAgIGdlbmVyYXRlU2NvcGVkTmFtZTogJ1tuYW1lXV9fW2xvY2FsXV9fX1toYXNoOmJhc2U2NDo1XSdcbiAgICB9LFxuICAgIC8vIE9wdGltaXplIENTU1xuICAgIGRldlNvdXJjZW1hcDogdHJ1ZSxcbiAgICBwcmVwcm9jZXNzb3JPcHRpb25zOiB7XG4gICAgICBzY3NzOiB7XG4gICAgICAgIGFkZGl0aW9uYWxEYXRhOiBgQGltcG9ydCBcIi4vc3JjL3N0eWxlcy92YXJpYWJsZXMuc2Nzc1wiO2BcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGJ1aWxkOiB7XG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcbiAgICBtaW5pZnk6ICd0ZXJzZXInLFxuICAgIHNvdXJjZW1hcDogZmFsc2UsIC8vIERpc2FibGUgc291cmNlbWFwcyBpbiBwcm9kdWN0aW9uXG4gICAgLy8gT3B0aW1pemUgY2h1bmsgc2l6ZVxuICAgIGNodW5rU2l6ZVdhcm5pbmdMaW1pdDogMTAwMCxcbiAgICAvLyBFbmFibGUgQ1NTIGNvZGUgc3BsaXR0aW5nXG4gICAgY3NzQ29kZVNwbGl0OiB0cnVlLFxuICAgIC8vIE9wdGltaXplIHJvbGx1cCBvcHRpb25zXG4gICAgcm9sbHVwT3B0aW9uczoge1xuICAgICAgb3V0cHV0OiB7XG4gICAgICAgIC8vIE9wdGltaXplIGNodW5rIHNwbGl0dGluZyB3aXRoIGJldHRlciBncmFudWxhcml0eVxuICAgICAgICBtYW51YWxDaHVua3M6IChpZCkgPT4ge1xuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzLycpKSByZXR1cm4gJ3ZlbmRvcic7XG4gICAgICAgIH0sXG4gICAgICAgIC8vIE9wdGltaXplIGNodW5rIGxvYWRpbmcgd2l0aCBiZXR0ZXIgbmFtaW5nXG4gICAgICAgIGNodW5rRmlsZU5hbWVzOiAoY2h1bmtJbmZvKSA9PiB7XG4gICAgICAgICAgY29uc3QgbmFtZSA9IGNodW5rSW5mby5uYW1lIHx8ICdjaHVuayc7XG4gICAgICAgICAgcmV0dXJuIGBhc3NldHMvanMvJHtuYW1lfS1baGFzaF0uanNgO1xuICAgICAgICB9LFxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9qcy9bbmFtZV0tW2hhc2hdLmpzJyxcbiAgICAgICAgYXNzZXRGaWxlTmFtZXM6ICdhc3NldHMvW2V4dF0vW25hbWVdLVtoYXNoXS5bZXh0XScsXG4gICAgICAgIC8vIE9wdGltaXplIGNvZGUgc3BsaXR0aW5nXG4gICAgICAgIGV4cGVyaW1lbnRhbE1pbkNodW5rU2l6ZTogMTAwMDAsXG4gICAgICB9LFxuICAgIH0sXG4gICAgLy8gT3B0aW1pemUgdGVyc2VyIG9wdGlvbnNcbiAgICB0ZXJzZXJPcHRpb25zOiB7XG4gICAgICBjb21wcmVzczoge1xuICAgICAgICBkcm9wX2NvbnNvbGU6IHRydWUsXG4gICAgICAgIGRyb3BfZGVidWdnZXI6IHRydWUsXG4gICAgICAgIHB1cmVfZnVuY3M6IFsnY29uc29sZS5sb2cnLCAnY29uc29sZS5pbmZvJywgJ2NvbnNvbGUuZGVidWcnLCAnY29uc29sZS53YXJuJ10sXG4gICAgICAgIHBhc3NlczogNSxcbiAgICAgICAgZGVhZF9jb2RlOiB0cnVlLFxuICAgICAgICB1bnNhZmU6IHRydWUsXG4gICAgICAgIHVuc2FmZV9hcnJvd3M6IHRydWUsXG4gICAgICAgIHVuc2FmZV9jb21wczogdHJ1ZSxcbiAgICAgICAgdW5zYWZlX0Z1bmN0aW9uOiB0cnVlLFxuICAgICAgICB1bnNhZmVfbWF0aDogdHJ1ZSxcbiAgICAgICAgdW5zYWZlX21ldGhvZHM6IHRydWUsXG4gICAgICAgIHVuc2FmZV9wcm90bzogdHJ1ZSxcbiAgICAgICAgdW5zYWZlX3JlZ2V4cDogdHJ1ZSxcbiAgICAgICAgdW5zYWZlX3VuZGVmaW5lZDogdHJ1ZSxcbiAgICAgICAgc2VxdWVuY2VzOiB0cnVlLFxuICAgICAgICBib29sZWFuczogdHJ1ZSxcbiAgICAgICAgbG9vcHM6IHRydWUsXG4gICAgICAgIHVudXNlZDogdHJ1ZSxcbiAgICAgICAgaWZfcmV0dXJuOiB0cnVlLFxuICAgICAgICBqb2luX3ZhcnM6IHRydWUsXG4gICAgICAgIGNvbGxhcHNlX3ZhcnM6IHRydWUsXG4gICAgICAgIHJlZHVjZV92YXJzOiB0cnVlLFxuICAgICAgICBob2lzdF9mdW5zOiB0cnVlLFxuICAgICAgICBob2lzdF92YXJzOiB0cnVlLFxuICAgICAgICBwcm9wZXJ0aWVzOiB0cnVlLFxuICAgICAgICBrZWVwX2ZhcmdzOiBmYWxzZSxcbiAgICAgICAga2VlcF9pbmZpbml0eTogdHJ1ZSxcbiAgICAgIH0sXG4gICAgICBtYW5nbGU6IHtcbiAgICAgICAgc2FmYXJpMTA6IHRydWUsXG4gICAgICAgIHByb3BlcnRpZXM6IHtcbiAgICAgICAgICByZWdleDogL15fLyxcbiAgICAgICAgICByZXNlcnZlZDogWydfX2VzTW9kdWxlJ10sXG4gICAgICAgIH0sXG4gICAgICAgIHRvcGxldmVsOiB0cnVlLFxuICAgICAgfSxcbiAgICAgIGZvcm1hdDoge1xuICAgICAgICBjb21tZW50czogZmFsc2UsXG4gICAgICAgIGFzY2lpX29ubHk6IHRydWUsXG4gICAgICAgIGJlYXV0aWZ5OiBmYWxzZSxcbiAgICAgICAgYnJhY2VzOiBmYWxzZSxcbiAgICAgICAgc2VtaWNvbG9uczogdHJ1ZSxcbiAgICAgIH0sXG4gICAgfSxcbiAgICAvLyBFbmFibGUgYnVpbGQgb3B0aW1pemF0aW9uXG4gICAgYXNzZXRzSW5saW5lTGltaXQ6IDQwOTYsXG4gICAgY3NzTWluaWZ5OiB0cnVlLFxuICAgIHJlcG9ydENvbXByZXNzZWRTaXplOiBmYWxzZSxcbiAgICAvLyBPcHRpbWl6ZSBtb2R1bGUgbG9hZGluZ1xuICAgIG1vZHVsZVByZWxvYWQ6IHtcbiAgICAgIHBvbHlmaWxsOiB0cnVlLFxuICAgIH0sXG4gIH0sXG4gIG9wdGltaXplRGVwczoge1xuICAgIC8vIFByZS1idW5kbGUgZGVwZW5kZW5jaWVzXG4gICAgaW5jbHVkZTogW1xuICAgICAgJ3JlYWN0JyxcbiAgICAgICdyZWFjdC1kb20nLFxuICAgICAgJ3JlYWN0LXJvdXRlci1kb20nLFxuICAgICAgJ0BoZWFkbGVzc3VpL3JlYWN0JyxcbiAgICAgICdAaGVyb2ljb25zL3JlYWN0JyxcbiAgICAgICdheGlvcycsXG4gICAgICAnZGF0ZS1mbnMnLFxuICAgICAgJ2ZyYW1lci1tb3Rpb24nLFxuICAgIF0sXG4gICAgLy8gRXhjbHVkZSBkZXBlbmRlbmNpZXMgdGhhdCBzaG91bGQgbm90IGJlIHByZS1idW5kbGVkXG4gICAgZXhjbHVkZTogWydAdml0ZWpzL3BsdWdpbi1yZWFjdCddLFxuICAgIC8vIE9wdGltaXplIGRlcGVuZGVuY3kgcHJlLWJ1bmRsaW5nXG4gICAgZXNidWlsZE9wdGlvbnM6IHtcbiAgICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgICBzdXBwb3J0ZWQ6IHtcbiAgICAgICAgJ3RvcC1sZXZlbC1hd2FpdCc6IHRydWUsXG4gICAgICB9LFxuICAgICAgdHJlZVNoYWtpbmc6IHRydWUsXG4gICAgICBtaW5pZnk6IHRydWUsXG4gICAgICBtaW5pZnlJZGVudGlmaWVyczogdHJ1ZSxcbiAgICAgIG1pbmlmeVN5bnRheDogdHJ1ZSxcbiAgICAgIG1pbmlmeVdoaXRlc3BhY2U6IHRydWUsXG4gICAgfSxcbiAgfSxcbiAgLy8gRW5hYmxlIGNhY2hpbmdcbiAgY2FjaGVEaXI6ICcudml0ZV9jYWNoZScsXG4gIC8vIEVuYWJsZSBlc2J1aWxkIG9wdGltaXphdGlvblxuICBlc2J1aWxkOiB7XG4gICAganN4SW5qZWN0OiB1bmRlZmluZWQsXG4gICAganN4RmFjdG9yeTogJ1JlYWN0LmNyZWF0ZUVsZW1lbnQnLFxuICAgIGpzeEZyYWdtZW50OiAnUmVhY3QuRnJhZ21lbnQnLFxuICAgIHRhcmdldDogJ2VzbmV4dCcsXG4gICAgc3VwcG9ydGVkOiB7XG4gICAgICAndG9wLWxldmVsLWF3YWl0JzogdHJ1ZVxuICAgIH0sXG4gICAgLy8gT3B0aW1pemUgZXNidWlsZCBvcHRpb25zXG4gICAgbWluaWZ5OiB0cnVlLFxuICAgIG1pbmlmeUlkZW50aWZpZXJzOiB0cnVlLFxuICAgIG1pbmlmeVN5bnRheDogdHJ1ZSxcbiAgICBtaW5pZnlXaGl0ZXNwYWNlOiB0cnVlLFxuICAgIHRyZWVTaGFraW5nOiB0cnVlLFxuICAgIGxlZ2FsQ29tbWVudHM6ICdub25lJyxcbiAgfSxcbiAgLy8gT3B0aW1pemUgcHJldmlldyBzZXJ2ZXJcbiAgcHJldmlldzoge1xuICAgIHBvcnQ6IDQxNzMsXG4gICAgc3RyaWN0UG9ydDogdHJ1ZSxcbiAgICBob3N0OiB0cnVlLFxuICAgIGh0dHBzOiBmYWxzZSxcbiAgICBvcGVuOiB0cnVlLFxuICAgIGNvcnM6IHRydWUsXG4gICAgaGVhZGVyczoge1xuICAgICAgJ0FjY2Vzcy1Db250cm9sLUFsbG93LU9yaWdpbic6ICcqJyxcbiAgICB9LFxuICB9LFxufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBNlMsU0FBUyxvQkFBb0I7QUFDMVUsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsbUJBQW1CO0FBQzVCLFNBQVMsa0JBQWtCO0FBQzNCLFNBQVMsOEJBQThCO0FBQ3ZDLFNBQVMsZUFBZTtBQUN4QixTQUFTLGVBQWU7QUFOeEIsSUFBTSxtQ0FBbUM7QUFTekMsSUFBTyxzQkFBUSxhQUFhO0FBQUEsRUFDMUIsU0FBUztBQUFBLElBQ1AsTUFBTTtBQUFBLE1BQ0osT0FBTztBQUFBLFFBQ0wsU0FBUztBQUFBLFVBQ1AsQ0FBQyxtQ0FBbUM7QUFB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
