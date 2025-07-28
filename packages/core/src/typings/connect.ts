import type * as utils from '@joey-wallet/wc-utils';

import type { SessionTypes } from '@walletconnect/types';
import type Provider from '@walletconnect/universal-provider';

import type { EnhancedNamespaceConfig, WalletDetail } from './other';

export interface IConnectOpts {
  chain?: string;
  pairing?: { topic: string };
  openModal?: boolean;
}

export interface IGenerateOpts {
  chain?: string;
  walletId?: string;
  pairing?: { topic: string };
  openModal?: boolean;
}

export interface IConnectionDetails {
  verbose?: boolean;
  details: {
    uri: string;
    session: SessionTypes.Struct;
  };
}

export type TConnectionOpts = {
  projectId: string;
  chain: string;
  namespaces: EnhancedNamespaceConfig;
  walletDetails?: WalletDetail[];
  pairing?: { topic: string };
  openModal?: boolean;
  provider: Provider;
  logger?: utils.Logger;
};

export interface IConnectionDetails {
  verbose?: boolean;
  details: {
    uri: string;
    session: SessionTypes.Struct;
  };
}
