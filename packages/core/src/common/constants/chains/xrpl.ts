// constants.ts
import type * as typings from '~/typings';

// Namspace identifier for XRPL
export const Namespace = 'xrpl';

// Enum for default XRPL methods
export enum DEFAULT_METHODS {
  XRPL_SIGN_TRANSACTION = 'xrpl_signTransaction',
  XRPL_SIGN_TRANSACTION_FOR = 'xrpl_signTransactionFor',
  XRPL_SIGN_TRANSACTION_BATCH = 'xrpl_signTransactionBatch',
  XRPL_SIGN_TRANSACTION_FEE = 'xrpl_signTransactionFee',
}

// Enum for default XRPL events (empty for now, can be extended later)
export enum DEFAULT_EVENTS {
  // Add event names here if needed, e.g., CONNECTION = 'connection'
}

// Enum for XRPL chain identifiers
export enum ChainIdentifier {
  mainnet = `${Namespace}:0`,
  testnet = `${Namespace}:1`,
  devnet = `${Namespace}:2`,
}

// Chain data for XRPL mainnet
export const mainnet: typings.ChainDetails = {
  id: ChainIdentifier.mainnet,
  name: 'XRPL',
  http: ['https://s1.ripple.com:51234/'],
  ws: ['wss://s1.ripple.com/'],
  nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 6 },
  explorers: [{ name: 'XRPL Explorer', url: 'https://livenet.xrpl.org/' }],
  isDev: false,
};

// Chain data for XRPL testnet
export const testnet: typings.ChainDetails = {
  id: ChainIdentifier.testnet,
  name: 'XRPL Testnet',
  http: ['https://s.altnet.rippletest.net:51234/'],
  ws: ['wss://s.altnet.rippletest.net:51234/'], // Fixed: Changed https:// to wss://
  nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 6 },
  explorers: [{ name: 'XRPL Testnet Explorer', url: 'https://testnet.xrpl.org/' }], // Fixed: Correct explorer URL
  isDev: true,
};

// Chain data for XRPL devnet
export const devnet: typings.ChainDetails = {
  id: ChainIdentifier.devnet,
  name: 'XRPL Devnet',
  http: ['https://s.devnet.rippletest.net:51234/'],
  ws: ['wss://s.devnet.rippletest.net:51234/'], // Fixed: Ensured wss://
  nativeCurrency: { name: 'XRP', symbol: 'XRP', decimals: 6 },
  explorers: [{ name: 'XRPL Devnet Explorer', url: 'https://devnet.xrpl.org/' }], // Fixed: Correct explorer URL
  isDev: true,
};

// Map of chain identifier to chain details
export const AvailableChains = {
  [ChainIdentifier.mainnet]: mainnet,
  [ChainIdentifier.testnet]: testnet,
  [ChainIdentifier.devnet]: devnet,
};

// Enhanced ecosystem namepace
export default Object.fromEntries([
  [
    Namespace,
    {
      chains: [mainnet, testnet, devnet],
      events: Object.values(DEFAULT_EVENTS),
      methods: Object.values(DEFAULT_METHODS) as string[],
    },
  ],
]) as typings.EnhancedNamespaceConfig;
