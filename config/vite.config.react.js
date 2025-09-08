import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createBaseConfig } from './vite.config.base.js'

export function createReactConfig(options = {}) {
  const baseConfig = createBaseConfig({
    formats: ['es', 'cjs'],
    external: ['react', 'react-dom', 'react/jsx-runtime'],
    plugins: [react()],
    ...options,
  })

  return defineConfig({
    ...baseConfig,
    esbuild: {
      jsx: 'automatic',
    },
  })
}