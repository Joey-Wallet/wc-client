import { defineConfig } from 'vite'
import { createBaseConfig } from '../../config/vite.config.base.js'

export default defineConfig(
  createBaseConfig({
    packageName: '@joey-wallet/wc-utils',
    external: [
      'lodash',
    ],
  })
)