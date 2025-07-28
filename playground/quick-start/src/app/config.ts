// File: ./src/app/config.ts
import type { Config } from '@joey-wallet/wc-client';

export default {
  // Required
  projectId: process.env['NEXT_PUBLIC_PROJECT_ID'],
  // Optional - Add your projects details
  metadata: {
    name: 'Joey Example Project',
    description: 'A sample project using walletconnect and Joey Wallet.',
    url: 'http://localhost:3000',
    icons: ['/assets/favicon.ico'],
    redirect: {
      universal: 'http://localhost:3000',
    },
  },
} as Config;
