import { defineConfig } from 'vite'
import { createBaseConfig } from '../../config/vite.config.base.js'

export default defineConfig(
  createBaseConfig({
    packageName: '@joey-wallet/wc-ui',
    external: [
      '@walletconnect/types',
      '@walletconnect/universal-provider', 
      '@walletconnect/utils',
      'eventemitter3',
    ],
  })
)