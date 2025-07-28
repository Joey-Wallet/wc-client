export * as chain from './chain';
export * as other from './other';
export * as config from './other';
export * as events from './events';
export * as connect from './connect';

export { IConfig as ProviderConfig } from './config';
export { ChainDetails } from './config';

export { EProviderEvents } from './events';
export {
  Metadata,
  WalletDetail,
  EnhancedNamespace,
  EnhancedNamespaceConfig,
  NamespaceKey,
} from './other';

export {
  TConnectionOpts as ConnectionOpts,
  IConnectionDetails as CnnectionDetails,
} from './connect';
