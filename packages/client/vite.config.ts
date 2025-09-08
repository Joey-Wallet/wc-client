import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createBaseConfig } from '../../config/vite.config.base.js'

export default defineConfig({
  ...createBaseConfig({
    packageName: '@joey-wallet/wc-client',
    external: [
      '@walletconnect/types',
      '@walletconnect/universal-provider',
      '@walletconnect/utils',
      'eventemitter3',
      '@joey-wallet/wc-core',
      '@joey-wallet/wc-core/utils',
      '@joey-wallet/wc-react',
      '@joey-wallet/wc-react/standalone',
    ],
  }),
  build: {
    ...createBaseConfig({
      packageName: '@joey-wallet/wc-client',
    }).build,
    lib: {
      entry: {
        index: resolve(process.cwd(), 'src/index.ts'),
        core: resolve(process.cwd(), 'src/core.ts'),
        utils: resolve(process.cwd(), 'src/utils.ts'),
        react: resolve(process.cwd(), 'src/react.ts'),
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      ...createBaseConfig({
        packageName: '@joey-wallet/wc-client',
      }).build?.rollupOptions,
      external: [
        '@walletconnect/types',
        '@walletconnect/universal-provider',
        '@walletconnect/utils',
        'eventemitter3',
        '@joey-wallet/wc-core',
        '@joey-wallet/wc-core/utils',
        '@joey-wallet/wc-react',
        '@joey-wallet/wc-react/standalone',
      ]
    }
  }
})