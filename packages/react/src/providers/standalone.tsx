'use client';
import React from 'react';

import UniversalProvider from '@walletconnect/universal-provider';

import * as utils from '@joey-wallet/wc-utils';
import * as core from '@joey-wallet/wc-core';

import { DefaultContext } from './_common';
import type { ReactNode } from 'react';

import type * as typings from '~/typings';
import { ProviderEvents } from '~/typings';

/**
 * Context
 */
export const ClientContext = React.createContext<typings.IContext>(DefaultContext);

export type ProviderConfig = typings.ProviderConfig;

/**
 * Provider
 */
export function Provider({
  config,
  children,
}: {
  config: typings.ProviderConfig;
  children: ReactNode | ReactNode[];
}) {
  const _config = React.useMemo(() => core.utils.configBuilder(config), [config]);
  const logger = React.useMemo(
    () => new utils.Logger({ verbose: Boolean(config.verbose) }),
    [config.verbose]
  );

  const [isMounted, setIsMounted] = React.useState(false);
  const [provider, setProvider] = React.useState<UniversalProvider>();
  const [chains, setChains] = React.useState<string[]>();
  const [accounts, setAccounts] = React.useState<string[]>();
  const [chain, setChain] = React.useState<string>(_config.defaultChain);
  const [session, setSession] = React.useState<typings.TSession>();
  const [uri, setUri] = React.useState<string>();

  const initialize = React.useCallback(async () => {
    try {
      logger.info('INFO', 'initializing new provider...');
      logger.info('INFO', `${_config.projectId}`);

      // Check if provider exists and destroy it
      if (provider) {
        logger.info('INFO', 'Destroying existing provider...');
        await actions.disconnect();
        setProvider(undefined);
      }

      const newProvider = await UniversalProvider.init({
        projectId: _config.projectId,
        metadata: core.utils.general.buildMetadata(_config),
        logger: _config.verbose ? undefined : 'silent',
        storage: core.utils.general.handleStorage(_config),
      });
      setProvider(newProvider);
    } catch (error) {
      logger.error('Provider initialization failed:', error);
    }
  }, [_config, _config.projectId, _config.metadata, _config.verbose, logger]);

  React.useEffect(() => {
    if (!isMounted) return;
    // const isActive = { current: true };
    initialize();
    // return () => {
    //   isActive.current = false;
    // };
  }, [initialize, isMounted]);

  const _loadPersistedData = React.useCallback(() => {
    logger.info('INFO', 'loading persisted data...');

    setUri(provider?.uri);
    setSession(provider?.session);
  }, [provider, session, chain]);

  const reset = React.useCallback(() => {
    logger.info('INFO', 'resetting...');
    setUri(undefined);
    setSession(undefined);
    setChains(undefined);
    setAccounts(undefined);
    setChain(_config.defaultChain);
  }, [config.defaultChain, logger]);

  const setActiveChain = React.useCallback(
    (newChain: string) => {
      if (provider && session) {
        provider.disconnect();
        reset();
      }
      setChain(newChain);
    },
    [provider, session, reset]
  );

  const _subscribeToEvents = React.useCallback(() => {
    logger.info('subscribeToEvents...');

    const record = (event: string) => logger.info('Subscription Event', event);

    provider?.on(ProviderEvents.CONNECT, () => {
      record(ProviderEvents.CONNECT);
      _loadPersistedData();
    });

    provider?.on(ProviderEvents.URI, (_display_uri: string) => {
      record(ProviderEvents.URI);
      _loadPersistedData();
    });

    provider?.on(ProviderEvents.DELETE, () => {
      record(ProviderEvents.DELETE);
      _loadPersistedData();
    });

    provider?.on(ProviderEvents.PROVIDER_CONNECT, () => {
      record(ProviderEvents.PROVIDER_CONNECT);
      _loadPersistedData();
    });

    provider?.on(ProviderEvents.PROVIDER_DISCONNECT, () => {
      record(ProviderEvents.PROVIDER_DISCONNECT);
      reset();
    });

    provider?.on(ProviderEvents.PROVIDER_ERROR, () => {
      record(ProviderEvents.PROVIDER_ERROR);
    });

    provider?.on(ProviderEvents.REQUEST_SENT, () => record(ProviderEvents.REQUEST_SENT));

    provider?.on(ProviderEvents.UPDATE, () => {
      record(ProviderEvents.UPDATE);
      _loadPersistedData();
    });

    provider?.on(ProviderEvents.PING, () => record(ProviderEvents.PING));

    provider?.on(ProviderEvents.EVENT, () => record(ProviderEvents.EVENT));

    provider?.on(ProviderEvents.DELETE, () => {
      record(ProviderEvents.DELETE);
      reset();
    });

    provider?.on(ProviderEvents.EXPIRE, () => {
      record(ProviderEvents.EXPIRE);
      reset();
    });
  }, [provider, session]);

  const sessionState = React.useMemo(
    () => ({
      accounts: core.utils.session.getAllAccounts(session),
      chains: core.utils.session.getChains(session),
    }),
    [session]
  );

  React.useEffect(() => {
    setAccounts(sessionState.accounts);
    setChains(sessionState.chains);
  }, [sessionState]);

  React.useEffect(() => {
    if (provider) {
      _loadPersistedData();
      _subscribeToEvents();
    }
    return () => {
      reset;
    };
  }, [provider, _loadPersistedData, _subscribeToEvents]);

  const actionUpdate = React.useCallback(
    <T,>(result: T): T => {
      _loadPersistedData();
      return result;
    },
    [_loadPersistedData]
  );

  const connect = React.useCallback(
    async (opts: Partial<core.typings.ConnectionOpts> = {}) => {
      if (!provider) throw new Error('Provider is not initialized');
      const _opts = { provider, chain, logger, ..._config, ...opts };

      const result = await core.utils.general.handleConnection(_opts);
      if (result.error) throw result.error;

      logger.info('updating active session..');
      setChain(_opts.chain);
      setSession(result.data.response);
      return actionUpdate(result.data.response);
    },
    [provider, chain, logger, _config, _config.projectId, _config.metadata, actionUpdate]
  );

  const reconnect = React.useCallback(
    async (_session: typings.TSession) => {
      if (!provider) throw new Error('Provider is not initialized');
      await provider.connect({
        pairingTopic: _session.pairingTopic,
      });
      return actionUpdate(undefined);
    },
    [provider, actionUpdate]
  );

  const disconnect = React.useCallback(async () => {
    if (!provider) throw new Error('Provider is not initialized');
    await provider.disconnect();
    return actionUpdate(undefined);
  }, [provider, actionUpdate]);

  const generate = React.useCallback(
    async (opts: Partial<core.typings.connect.IGenerateOpts> = {}) => {
      if (!provider) throw new Error('Provider is not initialized');
      const _opts = { provider, chain, logger, ..._config, ...opts };

      const _generate = await core.utils.connect.generateDetails(_opts);
      if (_generate.error) throw _generate.error;

      setChain(_opts.chain);
      return actionUpdate(_generate.data);
    },
    [provider, chain, logger, _config, _config.projectId, _config.metadata, actionUpdate]
  );

  const actions = React.useMemo(
    () => ({
      connect: utils.safeAsync(connect),
      reconnect: utils.safeAsync(reconnect),
      disconnect: utils.safeAsync(disconnect),
      generate: utils.safeAsync(generate),
    }),
    [connect, reconnect, disconnect, generate]
  );

  React.useEffect(() => {
    _loadPersistedData();
    _subscribeToEvents();

    return () => {
      reset();
    };
  }, [provider]);

  React.useEffect(() => {
    if (typeof window !== 'undefined') setIsMounted(true);
  }, []);

  const value = React.useMemo(
    () => ({
      config: _config,
      provider,
      actions,
      session,
      accounts,
      chains,
      chain,
      setChain: setActiveChain,
      uri,
    }),
    [config, provider, uri, session, accounts, chains, chain]
  );

  if (!isMounted) {
    return <ClientContext.Provider value={DefaultContext}>{children}</ClientContext.Provider>;
  }

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export const useProvider = () => React.useContext(ClientContext);
