import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { createBaseConfig } from './vite.config.base.js'

export function createVueConfig(options = {}) {
  const baseConfig = createBaseConfig({
    formats: ['es', 'cjs'],
    external: ['vue'],
    plugins: [vue()],
    ...options,
  })

  return defineConfig({
    ...baseConfig,
    build: {
      ...baseConfig.build,
      rollupOptions: {
        ...baseConfig.build.rollupOptions,
        output: {
          ...baseConfig.build.rollupOptions.output,
          globals: {
            vue: 'Vue',
            ...baseConfig.build.rollupOptions.output.globals,
          },
        },
      },
    },
  })
}