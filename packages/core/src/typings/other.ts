import type { SignClientTypes } from '@walletconnect/types';
import type { Namespace, NamespaceConfig } from '@walletconnect/universal-provider';
import type * as utils from '~/utils';

import type * as chain from './chain';

export type Metadata = SignClientTypes.Metadata;

export interface Storage {
  // Enable storage for persisting sessions and data. Default: true.
  enabled: boolean;
  // Custom key-value storage implementation (e.g., localStorage, AsyncStorage). Default: null (uses browser localStorage).
  custom?: utils.storage.IKeyValueStorage;
}

export type NamespaceKey = string;

export interface EnhancedNamespace extends Omit<Namespace, 'chains'> {
  chains: chain.Details[];
}

export interface EnhancedNamespaceConfig {
  [namespace: NamespaceKey]: EnhancedNamespace;
}

export interface WalletDetail {
  projectId: string;
  name?: string;
  deeplinkFormat?: string;
}
