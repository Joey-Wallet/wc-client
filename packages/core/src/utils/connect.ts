import * as utils from '@joey-wallet/wc-utils';

// @ts-ignore -- ignore bundler error for cjs compile
import * as appkit from '@reown/appkit/core';
import * as namespace from './namespace';
import * as general from './general';

import type * as typings from '~/typings';
import * as constants from '~/common/constants';
import { xrpl, xrplNamespace } from '~/common/constants/chains';

export const handleConnection = async (opts: typings.ConnectionOpts) =>
  utils.asyncCatch(async () => {
    const {
      provider,
      chain = xrpl.mainnet.id,
      namespaces = xrplNamespace,
      pairing = undefined,
      logger = new utils.Logger({ verbose: false }),
    } = opts;

    const requiredNamespaces = namespace.getNamespaces({
      chain,
      namespaces,
    });
    const optionalNamespaces = namespace.mutateNamespaces(namespaces);

    logger.info('requiredNamespaces config for connect:', requiredNamespaces);

    // Await a successful connection from wallet
    const session = await provider.connect({
      pairingTopic: pairing?.topic,
      namespaces: requiredNamespaces,
      optionalNamespaces,
    });

    if (!session) throw new Error('Session not produced as a result of connection request');
    if (!provider.uri) throw new Error('Uri could not be determined during connection request');

    return { uri: provider.uri, session };
  });

export const generateModal = (opts: typings.ConnectionOpts) =>
  utils.tryCatch(() => {
    const {
      projectId,
      provider,
      chain = xrpl.mainnet.id,
      namespaces = xrplNamespace,
      walletDetails = constants.preferredWallets,
      openModal = true,
      logger = new utils.Logger({ verbose: false }),
    } = opts;

    if (!openModal) {
      logger.info('Modal is disabled');
      return null;
    }

    const chainDetails = namespace.getChainDetails({ chain, namespaces });
    if (!chainDetails)
      throw new Error('COunld not determine the chain detail required for the AppKit modal');

    const details = namespace.getAppKitChain(chainDetails);
    const optionalNamespaces = namespace.mutateNamespaces(namespaces);

    const featuredWalletIds = general.generateWalletOptions(walletDetails).ids;

    const modal = appkit.createAppKit({
      projectId,
      networks: [details],
      universalProvider: provider,
      manualWCControl: true,
      featuredWalletIds,
      universalProviderConfigOverride: {
        defaultChain: chain,
        ...optionalNamespaces,
      },
    });

    return { ...opts, modal };
  });

export const generateDetails = (opts: typings.ConnectionOpts & typings.connect.IGenerateOpts) =>
  utils.asyncCatch(async () => {
    {
      const featuredWallets = general.generateWalletOptions(opts.walletDetails).details;

      handleConnection(opts);

      return new Promise<{ uri: string; deeplink: string }>((resolve, reject) => {
        const timeout = setTimeout(() => {
          reject(new Error('Connection timed out: No URI received within the timeout period'));
        }, 5 * 1000);

        opts.provider.on('display_uri', (display_uri: string) => {
          clearTimeout(timeout);

          opts.logger?.info('URI', 'uri generated...');

          const uri = display_uri;

          // Format a deeplink using the provided wallet information
          // Standard walletconnect deeplink
          let deeplink = `wc://${uri}`;

          // Attempt to get custom deeplink format
          const deeplinkFormat = featuredWallets.find(
            (wallet) => wallet.projectId === opts.walletId
          )?.deeplinkFormat;
          if (deeplinkFormat) deeplink = `${deeplinkFormat}${encodeURIComponent(uri)}`;

          resolve({ uri, deeplink });
        });
      });
    }
  });
