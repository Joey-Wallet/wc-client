import * as utils from '@joey-wallet/wc-utils';

import { getAppMetadata } from '@walletconnect/utils';
import * as connect from './connect';
import * as storage from './storage';
import type * as typings from '~/typings';

import * as constants from '~/common/constants';

export const handleConnection = async (opts: typings.ConnectionOpts) =>
  utils.asyncCatch(async () => {
    const generate = connect.generateModal(opts);

    if (generate.error) throw generate.error;
    const modal = generate.data?.modal;

    // Open modal if enabled
    modal?.open();

    const connection = await connect.handleConnection(opts);
    if (connection.error) {
      modal?.close();
      throw connection.error;
    }

    modal?.close();
    return { response: connection.data.session, modal };
  });

export const buildMetadata = (config: typings.ProviderConfig) => {
  const { redirect: defaultRedirect, ...otherMetadata } = getAppMetadata();
  const { redirect: userDefinedRedirect, ...otherUserMetadata } = config.metadata ?? {
    redirect: undefined,
  };

  const redirect = Object.assign({}, defaultRedirect, userDefinedRedirect);

  return Object.assign(
    {
      name: 'wc-client DApp',
      description: 'A client for XRP Ledger via WalletConnect',
      url: 'http://localhost',
      icons: [],
      redirect,
    },
    otherMetadata,
    otherUserMetadata
  );
};

export const handleStorage = (config: typings.ProviderConfig) => {
  // Defaults to using IndexDB for presistent storage
  const { enabled = true, custom = undefined } = config.storage ?? {};

  let _storage: storage.IKeyValueStorage | undefined = enabled
    ? undefined
    : new storage.NoStorage();
  if (enabled) _storage = custom;

  return _storage;
};

export const generateWalletOptions = (userDefinedWallets?: typings.WalletDetail[]) => {
  const defaultWalletIds = constants.preferredWallets.map((wallet) => wallet.projectId);
  const userWalletIds = userDefinedWallets
    ? userDefinedWallets.map((wallet) => wallet.projectId)
    : ([] as string[]);

  const combined = [...constants.preferredWallets, ...(userDefinedWallets ?? [])];
  const ids = [...new Set([...defaultWalletIds, ...userWalletIds])];

  const details = ids
    .map((_id) => combined.find((det) => det.projectId == _id))
    .filter(Boolean) as typings.WalletDetail[];

  // Add user-defined walletIds and remove duplicates
  return { ids, details };
};
