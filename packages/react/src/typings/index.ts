'use client';
import * as core from '@joey-wallet/wc-core';
import type UniversalProvider from '@walletconnect/universal-provider';

import type * as utils from '@joey-wallet/wc-utils';

import type { PairingTypes, SessionTypes } from '@walletconnect/types';

import type * as typings from '~/typings';

export type TSession = SessionTypes.Struct;
export type TPairings = PairingTypes.Struct;
export type Provider = UniversalProvider;

export type ProviderConfig = core.typings.ProviderConfig;
export const ProviderEvents = core.typings.EProviderEvents;

export interface IActions {
  connect: (
    opts?: Partial<core.typings.ConnectionOpts>
  ) => Promise<utils.lib.catch.TResult<TSession | undefined, Error>>;
  reconnect: (session: TSession) => Promise<utils.lib.catch.TResult<void, Error>>;
  disconnect: () => Promise<utils.lib.catch.TResult<void, Error>>;
  generate: (
    opts?: Partial<core.typings.ConnectionOpts> & {
      walletId?: string;
    }
  ) => Promise<
    utils.lib.catch.TResult<
      {
        uri: string;
        deeplink: string;
      },
      Error
    >
  >;
}

export interface IContext {
  config: typings.ProviderConfig;

  provider?: UniversalProvider;
  //
  session?: TSession;
  accounts?: string[];
  chains?: string[];
  chain: string;
  setChain: (chain: string) => void;
  uri?: string;
  //
  actions: IActions;
  api?: core.provider.Api;
  self?: core.provider.Provider;
}
