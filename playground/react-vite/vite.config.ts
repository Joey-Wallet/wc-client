import { defineConfig, loadEnv } from 'vite';
import { tanstackStart } from '@tanstack/react-start/plugin/vite';
import viteReact from '@vitejs/plugin-react';
import viteTsConfigPaths from 'vite-tsconfig-paths';
import tailwindcss from '@tailwindcss/vite';

const config = defineConfig(({ mode }) => {
  // Load env file based on `mode` in the current working directory.
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      // this is the plugin that enables path aliases
      viteTsConfigPaths({
        projects: ['./tsconfig.json'],
      }),
      tailwindcss(),
      tanstackStart({
        customViteReactPlugin: true,
      }),
      viteReact(),
    ],
    envDir: '.', // Look for .env files in the project root
    envPrefix: 'VITE_', // Only load env vars that start with VITE_
    define: {
      // Make env variables available to the client
      'import.meta.env.VITE_PROJECT_ID': JSON.stringify(env.VITE_PROJECT_ID || ''),
      'import.meta.env.VITE_NODE_ENV': JSON.stringify(env.VITE_NODE_ENV || ''),
    },
  };
});

export default config;
