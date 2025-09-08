import { defineConfig } from 'vite'
import { resolve } from 'path'
import { createReactConfig } from '../../config/vite.config.react.js'

export default defineConfig({
  ...createReactConfig({
    packageName: '@joey-wallet/wc-react',
    external: [
      'react',
      'react-dom', 
      'react/jsx-runtime',
      '@walletconnect/types',
      '@walletconnect/universal-provider',
      '@walletconnect/utils',
      'eventemitter3',
      '@joey-wallet/wc-core',
      '@joey-wallet/wc-utils',
    ],
  }),
  build: {
    ...createReactConfig({
      packageName: '@joey-wallet/wc-react',
    }).build,
    lib: {
      entry: {
        index: resolve(process.cwd(), 'src/index.ts'),
        standalone: resolve(process.cwd(), 'src/standalone.ts'),
      },
      formats: ['es', 'cjs']
    }
  }
})