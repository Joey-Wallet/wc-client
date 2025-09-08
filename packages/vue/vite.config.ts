import { defineConfig } from 'vite'
import { createVueConfig } from '../../config/vite.config.vue.js'

export default defineConfig(
  createVueConfig({
    packageName: '@joey-wallet/wc-vue',
    external: [
      'vue',
      '@walletconnect/types',
      '@walletconnect/universal-provider',
      '@walletconnect/utils',
      'eventemitter3',
    ],
  })
)