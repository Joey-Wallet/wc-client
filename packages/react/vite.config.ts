import { defineConfig } from 'vite'
import { createReactConfig } from '../../config/vite.config.react.js'

export default defineConfig(
  createReactConfig({
    packageName: '@joey-wallet/wc-react',
    external: [
      'react',
      'react-dom', 
      'react/jsx-runtime',
      '@walletconnect/types',
      '@walletconnect/universal-provider',
      '@walletconnect/utils',
      'eventemitter3',
    ],
  })
)