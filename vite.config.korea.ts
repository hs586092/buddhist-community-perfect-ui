import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    outDir: 'dist',
    assetsDir: 'static',
    sourcemap: false, // 비용 절약을 위해 소스맵 비활성화
    rollupOptions: {
      output: {
        manualChunks: {
          // 한국어 특화 청크 분할
          'korean-vendor': ['react', 'react-dom'],
          'korean-ui': ['lucide-react', '@aws-amplify/ui-react'],
          'korean-aws': ['aws-amplify', '@aws-amplify/api', '@aws-amplify/auth']
        }
      }
    },
    chunkSizeWarningLimit: 500,
    minify: 'esbuild'
  },
  define: {
    __COUNTRY__: '"KR"',
    __CURRENCY__: '"KRW"',
    __TIMEZONE__: '"Asia/Seoul"',
    __LANGUAGE__: '"ko"'
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@korean': resolve(__dirname, 'src/locales/ko')
    }
  },
  server: {
    port: 3000,
    host: true
  },
  preview: {
    port: 4173,
    host: true
  }
})
