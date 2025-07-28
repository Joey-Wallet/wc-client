import type * as core from '@joey-wallet/wc-core';
import type * as typings from '~/typings';

export const DefaultContext: typings.IContext = {
  config: {} as typings.ProviderConfig,
  actions: {
    connect: async (opts?: Partial<core.typings.ConnectionOpts>) => ({
      data: null,
      error: new Error('Provider not initialized'),
    }),
    reconnect: async (session: typings.TSession) => ({
      data: null,
      error: new Error('Provider not initialized'),
    }),
    disconnect: async () => ({
      data: null,
      error: new Error('Provider not initialized'),
    }),
    generate: async (opts?: Partial<core.typings.ConnectionOpts> & { walletId?: string }) => ({
      data: null,
      error: new Error('Provider not initialized'),
    }),
  },
  provider: undefined,
  session: undefined,
  accounts: undefined,
  chains: undefined,
  chain: '',
  setChain: () => {},
  uri: undefined,
  api: undefined,
  self: undefined,
};
