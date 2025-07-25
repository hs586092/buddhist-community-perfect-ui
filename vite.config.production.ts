import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

// Production-optimized Vite configuration for Buddhist Community
export default defineConfig({
  plugins: [
    react({
      // Enable React Fast Refresh in development only
      fastRefresh: process.env.NODE_ENV !== 'production',
      // Optimize JSX for production
      jsxRuntime: 'automatic',
    }),
  ],

  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@styles': resolve(__dirname, 'src/styles'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@assets': resolve(__dirname, 'src/assets'),
    },
  },

  // Production build optimization
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging (disabled for production)
    sourcemap: false,
    
    // Minification settings
    minify: 'terser',
    
    // Terser options for better compression
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
      },
      mangle: {
        safari10: true, // Fix Safari 10+ issues
      },
      format: {
        comments: false, // Remove comments
      },
    },

    // CSS code splitting
    cssCodeSplit: true,
    
    // Chunk size limit (500kb)
    chunkSizeWarningLimit: 500,
    
    // Advanced bundling configuration
    rollupOptions: {
      output: {
        // Manual chunking for optimal loading
        manualChunks: {
          // Core React libraries
          'dharma-core': ['react', 'react-dom'],
          
          // Animation library
          'lotus-animations': ['framer-motion'],
          
          // Phase 2 components (basic functionality)
          'sangha-foundation': [
            './src/components/phase2/HomeChoice',
            './src/components/phase2/ReviewSpace',
            './src/components/phase2/CommunityChat',
          ],
          
          // Phase 3 components (enhanced features)
          'enlightened-features': [
            './src/components/phase3/EnhancedReviewSpace',
            './src/components/phase3/EnhancedCommunityChat',
            './src/components/phase3/MobileOptimizedApp',
          ],
          
          // Buddhist special features
          'zen-wisdom': [
            './src/components/phase3/BuddhistFeatures',
            './src/components/phase3/FinalBuddhistApp',
          ],
          
          // Utility libraries (if any)
          'karma-utils': [
            './src/utils/dateUtils',
            './src/utils/formatUtils',
            './src/utils/validationUtils',
          ],
        },
        
        // Naming pattern for chunks
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '')
            : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        
        // Asset naming
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').pop();
          
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType || '')) {
            return 'assets/images/[name]-[hash][extname]';
          }
          
          if (/css/i.test(extType || '')) {
            return 'assets/styles/[name]-[hash][extname]';
          }
          
          if (/woff2?|eot|ttf|otf/i.test(extType || '')) {
            return 'assets/fonts/[name]-[hash][extname]';
          }
          
          return 'assets/[name]-[hash][extname]';
        },
        
        // Entry file naming
        entryFileNames: 'assets/js/[name]-[hash].js',
      },
      
      // External dependencies (if using CDN)
      external: [],
      
      // Input options
      input: {
        main: resolve(__dirname, 'index.html'),
      },
    },
    
    // Target modern browsers for better optimization
    target: 'es2020',
    
    // Enable CSS minification
    cssMinify: true,
    
    // Report compressed file sizes
    reportCompressedSize: true,
    
    // Fail on build warnings
    emptyOutDir: true,
  },

  // Preview server configuration (for testing production build)
  preview: {
    port: 4173,
    strictPort: true,
    open: true,
    cors: true,
  },

  // Performance optimizations
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'framer-motion',
    ],
    exclude: [
      // Exclude large libraries that should be loaded separately
    ],
  },

  // CSS preprocessing
  css: {
    devSourcemap: false,
    modules: {
      localsConvention: 'camelCaseOnly',
    },
    preprocessorOptions: {
      scss: {
        additionalData: `@import "@/styles/variables.scss";`,
      },
    },
  },

  // Environment variables
  define: {
    // App version from package.json
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    
    // Build timestamp
    __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
    
    // Environment
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development'),
    __PROD__: JSON.stringify(process.env.NODE_ENV === 'production'),
  },

  // Development server (not used in production but good to have)
  server: {
    port: 3000,
    strictPort: true,
    open: true,
    cors: true,
    hmr: {
      overlay: true,
    },
  },

  // esbuild configuration
  esbuild: {
    target: 'es2020',
    // Remove console and debugger in production
    drop: process.env.NODE_ENV === 'production' ? ['console', 'debugger'] : [],
    // Optimize for size
    treeShaking: true,
    // Legal comments
    legalComments: 'none',
  },
});