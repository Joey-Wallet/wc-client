import core from '@joey-wallet/wc-client/core';
import { config } from './config';

import { getBaseUrl } from '~/lib/helpers/url';

const chains = core.constants.chains;

export default {
  projectId: config.projectId,
  namespaces: chains.xrplNamespace,
  defaultChain: chains.xrpl.mainnet.id,
  verbose: true,
  storage: {
    enabled: true,
    custom: new core.utils.storage.LocalStorage(),
  },
  metadata: {
    name: 'WalletConnect Toolkit for XRPL + Joey Wallet',
    description:
      'A toolkit for testing WalletConnect integration with the XRP Ledger and Joey Wallet, enabling seamless wallet interactions and transaction testing.',
    url: getBaseUrl(),
    icons: ['/assets/favicon/favicon.ico'],
    redirect: {
      universal: getBaseUrl(),
    },
  },
} as core.typings.ProviderConfig;
