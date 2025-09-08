export * as chain from './chain';
export * as other from './other';
export * as config from './other';
export * as events from './events';
export * as connect from './connect';

export type { IConfig as ProviderConfig } from './config';
export type { ChainDetails } from './config';

export { EProviderEvents } from './events';
export type {
  Metadata,
  WalletDetail,
  EnhancedNamespace,
  EnhancedNamespaceConfig,
  NamespaceKey,
} from './other';

export type {
  TConnectionOpts as ConnectionOpts,
  IConnectionDetails as CnnectionDetails,
} from './connect';
