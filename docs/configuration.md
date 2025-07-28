## Configuration Options

The `wc-client` Provider requires a configuration object to initialize WalletConnect and connect to the XRP Ledger. Below is an example configuration file and a detailed explanation of available options, including the metadata field for WalletConnect project details.

```tsx
// File: ./src/common/wc-config.ts
import { Config } from '@joey-wallet/wc-client/react';
import core from '@joey-wallet/wc-client/core';

const chains = core.constants.chains;

export default {
    /**
   * WalletConnect Project ID from Reown Cloud
   * @see https://cloud.reown.com
   */
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Obtain from https://cloud.reown.com
  /**
   * Enhanced namespaces for the provider communication
   * Client needs a little more information for the chain information required by AppKit
   * Defaults to xrpl namespace
   */
  namespaces: chains.xrplNamespace,
  /**
   * Default chain for connection - set to active chain on initialization
   * If the network is changed, a new chain will need to be set (ie. setActive)
   * Defaults to first detected chain in namespaces
   */
  defaultChain: chains.xrpl.mainnet.id,
  /**
   * Wallet details for the preferred wallets for the modal and other interactions
   * Client reequired more information for deeplinking optimizations
   * Joey wallet will be included in this list if not provided
   */
  walletDetails: [{
      name: 'Joey Wallet',
      projectId: 'd9f5432e932c6fad8e19a0cea9d4a3372a84aed16e98a52e6655dd2821a63404',
      deeplinkFormat: 'joey://settings/wc?uri=',
  }],
    /**
   * Enable logging for troubleshooting.
   * @default false
   */
  verbose: true, // Enable debug logging (Optional)
  /**
   * Configure session data persistence.
   * The client uses persists session data using IndexDB
   * @default undefined
   */
  storage: {
    enabled: true, // Persist session data
    custom: null, // Optional: Custom storage implementation
  },
  /**
   * Project metadata for connection details - shown within the WalletKit
   * @see https://cloud.reown.com
   */
  metadata: {
    name: 'Your DApp Name',
    description: 'A decentralized application for XRP Ledger interactions',
    url: 'https://your-dapp.com',
    icons: ['https://your-dapp.com/icon.png'],
    redirect: 'https://your-dapp.com/wc', // Universal link for web
  },
} as Config;
```
