'use client';
import React from 'react';

import * as utils from '@joey-wallet/wc-utils';
import * as core from '@joey-wallet/wc-core';

import { DefaultContext } from './_common';
import type UniversalProvider from '@walletconnect/universal-provider';
import type { ReactNode } from 'react';

import type * as typings from '~/typings';

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
  const [chains, setChains] = React.useState<string[] | undefined>();
  const [accounts, setAccounts] = React.useState<string[] | undefined>();
  const [chain, setChain] = React.useState<string>(_config.defaultChain);
  const [session, setSession] = React.useState<typings.TSession | undefined>();
  const [uri, setUri] = React.useState<string | undefined>();

  const _provider = React.useMemo(() => {
    if (!isMounted) return undefined;
    return new core.provider.Provider(_config);
  }, [isMounted, _config, _config.projectId, _config.metadata]);

  const handleUpdate = React.useCallback(() => {
    logger.info('INFO', 'loading persisted data...');
    const _currentProvider = _provider?.manager.provider;
    if (!_currentProvider) return;

    setProvider(_currentProvider);

    setUri(_currentProvider.uri);
    setSession(_currentProvider.session);
  }, [_provider, logger]);

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
      if (_provider?.manager.provider && session) {
        _provider.manager.provider.disconnect();
        reset();
      }
      setChain(newChain);
      _provider?.setActiveChain(newChain);
    },
    [_provider, session, reset]
  );

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

  const actionUpdate = React.useCallback(
    <T,>(result: T): T => {
      handleUpdate();
      return result;
    },
    [handleUpdate]
  );

  const connect = React.useCallback(
    async (opts: Partial<core.typings.ConnectionOpts> = {}) => {
      if (!_provider) throw new Error('Provider is not initialized');
      const _opts = { provider, chain, logger, ..._config, ...opts };

      const result = await _provider.connect(_opts);
      if (result.error) throw result.error;

      logger.info('updating active session..');
      setSession(result.data);
      setChain(_opts.chain);
      return actionUpdate(result.data);
    },
    [_provider, provider, chain, logger, _config, _config.projectId, _config.metadata, actionUpdate]
  );

  const reconnect = React.useCallback(
    async (_session: typings.TSession) => {
      if (!_provider) throw new Error('Provider is not initialized');
      const target = _provider.api.findSession(_session.topic);
      const _reconnect = await target.reconnect();
      if (_reconnect.error) throw _reconnect.error;
      return actionUpdate(_reconnect.data);
    },
    [_provider, provider, actionUpdate]
  );

  const disconnect = React.useCallback(async () => {
    if (!_provider) throw new Error('Provider is not initialized');
    await _provider.manager.provider?.disconnect();
    return actionUpdate(undefined);
  }, [_provider, provider, actionUpdate]);

  const generate = React.useCallback(
    async (opts: Partial<core.typings.connect.IGenerateOpts> = {}) => {
      if (!_provider) throw new Error('Provider is not initialized');
      const _opts = { provider: _provider.manager.provider, chain, logger, ...config, ...opts };

      const _generate = await _provider.generateConnectionDetails(_opts);
      if (_generate.error) throw _generate.error;

      setChain(_opts.chain);
      return actionUpdate(_generate.data);
    },
    [_provider, provider, chain, logger, config, config.projectId, config.metadata, actionUpdate]
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

  // Event listener management
  React.useEffect(() => {
    if (!_provider) return;
    const updateHandler = () => handleUpdate();
    _provider.on(core.base.EBaseEvent.UPDATE, updateHandler);
    _provider.manager.on(core.base.EBaseEvent.UPDATE, updateHandler);
    updateHandler();
    return () => {
      _provider.off(core.base.EBaseEvent.UPDATE, updateHandler);
      _provider.manager.off(core.base.EBaseEvent.UPDATE, updateHandler);
    };
  }, [_provider]);

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
      api: _provider?.api,
      self: _provider,
    }),
    [_provider, actions, session, accounts, chains, chain, setActiveChain, uri, _config]
  );

  if (!isMounted) {
    return <ClientContext.Provider value={DefaultContext}>{children}</ClientContext.Provider>;
  }

  return <ClientContext.Provider value={value}>{children}</ClientContext.Provider>;
}

export const useProvider = () => React.useContext(ClientContext);
