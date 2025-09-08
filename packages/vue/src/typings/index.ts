import * as core from '@joey-wallet/wc-core';
import type UniversalProvider from '@walletconnect/universal-provider';
import type { ComputedRef, InjectionKey, Ref } from 'vue';

import type * as utils from '@joey-wallet/wc-utils';

import type { PairingTypes, SessionTypes } from '@walletconnect/types';

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
  config: ComputedRef<ProviderConfig>;

  provider: Ref<UniversalProvider | undefined>;
  //
  session: Ref<TSession | undefined>;
  accounts: Ref<string[] | undefined>;
  chains: Ref<string[] | undefined>;
  chain: Ref<string>;
  setChain: (chain: string) => void;
  uri: Ref<string | undefined>;
  //
  actions: ComputedRef<IActions>;
  api: ComputedRef<core.provider.Api | undefined>;
  self: Ref<core.provider.Provider | undefined>;
}

export const WALLET_CONNECT_CONTEXT_KEY: InjectionKey<IContext> = Symbol('WalletConnectContext');

export interface IProviderProps {
  config: ProviderConfig;
}
