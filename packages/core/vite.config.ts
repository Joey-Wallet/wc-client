import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

const external = [
  '@joey-wallet/wc-utils',
  '@walletconnect/types', 
  '@walletconnect/universal-provider',
  '@walletconnect/utils',
  'eventemitter3',
  '@reown/appkit',
  'big.js',
  'idb',
  'xrpl',
  'zod'
]

export default defineConfig({
  build: {
    lib: {
      entry: {
        index: resolve(process.cwd(), 'src/index.ts'),
        utils: resolve(process.cwd(), 'src/utils/index.ts'),
      },
      formats: ['es', 'cjs']
    },
    rollupOptions: {
      external,
      output: {
        globals: external.reduce((acc, dep) => {
          acc[dep] = dep.replace(/[@\/\-]/g, '_')
          return acc
        }, {}),
      },
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    dts({
      outDir: 'dist/types',
      include: ['src/**/*'],
      exclude: ['**/*.test.*', '**/*.spec.*'],
      rollupTypes: false,
      copyDtsFiles: true,
    }),
  ],
  resolve: {
    alias: {
      '~': resolve(process.cwd(), 'src'),
    },
  },
})