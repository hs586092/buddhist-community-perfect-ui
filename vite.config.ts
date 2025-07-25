/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import tsconfigPaths from 'vite-tsconfig-paths'

// https://vitejs.dev/config/
export default defineConfig({
  base: process.env.DEPLOY_TARGET === 'github-pages' ? '/buddhist-community-perfect-ui/' : 
        process.env.DEPLOY_TARGET === 'amplify' ? '/' : '/',
  plugins: [
    react(),
    tsconfigPaths(), // Enables TypeScript path mapping from tsconfig.json
  ],
  
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@components': resolve(__dirname, 'src/components'),
      '@pages': resolve(__dirname, 'src/pages'),
      '@utils': resolve(__dirname, 'src/utils'),
      '@types': resolve(__dirname, 'src/types'),
      '@hooks': resolve(__dirname, 'src/hooks'),
      '@services': resolve(__dirname, 'src/services'),
      '@assets': resolve(__dirname, 'src/assets')
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    cors: true,
    hmr: {
      overlay: true
    }
    // API proxy disabled - using sample data for spiritual community app
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: 'esbuild',
    target: 'esnext',
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          query: ['@tanstack/react-query', '@tanstack/react-query-devtools'],
          state: ['zustand'],
          motion: ['framer-motion'],
          utils: ['lucide-react']
        }
      }
    },
    // Performance optimizations
    chunkSizeWarningLimit: 1000
  },
  
  // CSS configuration
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase'
    }
  },
  
  // Environment variables
  envPrefix: 'VITE_',
  
  // Optimization settings
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      '@tanstack/react-query',
      'zustand',
      'framer-motion',
      'lucide-react'
    ]
  },
  
  // Preview configuration
  preview: {
    port: 4173,
    open: true
  },
  
  // Test configuration
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/**/*.{ts,tsx}'],
      exclude: [
        'src/**/*.d.ts',
        'src/**/*.test.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/test/**/*',
        'src/vite-env.d.ts',
        'src/main.tsx'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    }
  }
})