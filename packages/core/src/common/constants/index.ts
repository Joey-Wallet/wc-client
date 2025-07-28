import * as wallets from './wallets';
import type * as typings from '~/typings';

export * as chains from './chains';
export { default as DefaultMetadata } from './metadata';
export { wallets };

export const DEFAULT_LOGGER = 'debug';

export const preferredWallets: typings.WalletDetail[] = [wallets.joey];
