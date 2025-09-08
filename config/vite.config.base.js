import { defineConfig } from 'vite'
import { resolve } from 'path'
import dts from 'vite-plugin-dts'

export function createBaseConfig(options = {}) {
  const {
    packageName,
    entry = 'src/index.ts',
    formats = ['es', 'cjs'],
    external = [],
    plugins = [],
    additionalEntries = {},
  } = options

  // Add all workspace packages to external by default
  const workspaceExternal = [
    '@joey-wallet/wc-core',
    '@joey-wallet/wc-utils',
    '@joey-wallet/wc-client',
    '@joey-wallet/wc-react',
    '@joey-wallet/wc-vue',
    '@joey-wallet/wc-ui',
    ...external
  ]

  return defineConfig({
    build: {
      lib: {
        entry: resolve(process.cwd(), entry),
        name: packageName,
        formats,
        fileName: (format) => {
          const ext = format === 'es' ? 'js' : format === 'cjs' ? 'cjs' : 'js'
          return `${format}/index.${ext}`
        },
      },
      rollupOptions: {
        external: workspaceExternal,
        output: {
          globals: workspaceExternal.reduce((acc, dep) => {
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
      ...plugins,
    ],
    resolve: {
      alias: {
        '~': resolve(process.cwd(), 'src'),
      },
    },
  })
}