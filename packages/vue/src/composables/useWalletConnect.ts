import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import * as utils from '@joey-wallet/wc-utils';
import * as core from '@joey-wallet/wc-core';

import type UniversalProvider from '@walletconnect/universal-provider';
import type * as typings from '~/typings';

export function useWalletConnect(config: typings.ProviderConfig) {
  const _config = computed(() => core.utils.configBuilder(config));
  const logger = computed(() => new utils.Logger({ verbose: Boolean(config.verbose) }));

  const isMounted = ref(false);
  const provider = ref<UniversalProvider>();
  const chains = ref<string[] | undefined>();
  const accounts = ref<string[] | undefined>();
  const chain = ref<string>(_config.value.defaultChain);
  const session = ref<typings.TSession | undefined>();
  const uri = ref<string | undefined>();

  const _provider = computed(() => {
    if (!isMounted.value) return undefined;
    return new core.provider.Provider(_config.value);
  });

  const handleUpdate = () => {
    logger.value.info('INFO', 'loading persisted data...');
    const _currentProvider = _provider.value?.manager.provider;
    if (!_currentProvider) return;

    provider.value = _currentProvider;
    uri.value = _currentProvider.uri;
    session.value = _currentProvider.session;
  };

  const reset = () => {
    logger.value.info('INFO', 'resetting...');
    uri.value = undefined;
    session.value = undefined;
    chains.value = undefined;
    accounts.value = undefined;
    chain.value = _config.value.defaultChain;
  };

  const setActiveChain = (newChain: string) => {
    if (_provider.value?.manager.provider && session.value) {
      _provider.value.manager.provider.disconnect();
      reset();
    }
    chain.value = newChain;
    _provider.value?.setActiveChain(newChain);
  };

  const sessionState = computed(() => ({
    accounts: core.utils.session.getAllAccounts(session.value),
    chains: core.utils.session.getChains(session.value),
  }));

  watch(
    sessionState,
    (newState: { accounts: string[]; chains: string[] }) => {
      accounts.value = newState.accounts;
      chains.value = newState.chains;
    },
    { immediate: true }
  );

  const actionUpdate = <T>(result: T): T => {
    handleUpdate();
    return result;
  };

  const connect = async (opts: Partial<core.typings.ConnectionOpts> = {}) => {
    if (!_provider.value) throw new Error('Provider is not initialized');
    const _opts = {
      provider: provider.value,
      chain: chain.value,
      logger: logger.value,
      ..._config.value,
      ...opts,
    };

    const result = await _provider.value.connect(_opts);
    if (result.error) throw result.error;

    logger.value.info('updating active session..');
    session.value = result.data;
    chain.value = _opts.chain;
    return actionUpdate(result.data);
  };

  const reconnect = async (_session: typings.TSession) => {
    if (!_provider.value) throw new Error('Provider is not initialized');
    const target = _provider.value.api.findSession(_session.topic);
    const _reconnect = await target.reconnect();
    if (_reconnect.error) throw _reconnect.error;
    return actionUpdate(_reconnect.data);
  };

  const disconnect = async () => {
    if (!_provider.value) throw new Error('Provider is not initialized');
    await _provider.value.manager.provider?.disconnect();
    return actionUpdate(undefined);
  };

  const generate = async (opts: Partial<core.typings.connect.IGenerateOpts> = {}) => {
    if (!_provider.value) throw new Error('Provider is not initialized');
    const _opts = {
      provider: _provider.value.manager.provider,
      chain: chain.value,
      logger: logger.value,
      ...config,
      ...opts,
    };

    const _generate = await _provider.value.generateConnectionDetails(_opts);
    if (_generate.error) throw _generate.error;

    chain.value = _opts.chain;
    return actionUpdate(_generate.data);
  };

  const actions = computed(() => ({
    connect: utils.safeAsync(connect),
    reconnect: utils.safeAsync(reconnect),
    disconnect: utils.safeAsync(disconnect),
    generate: utils.safeAsync(generate),
  }));

  onMounted(() => {
    if (typeof window !== 'undefined') {
      isMounted.value = true;
    }
  });

  watch(
    _provider,
    (
      newProvider: InstanceType<typeof core.provider.Provider> | undefined,
      oldProvider: InstanceType<typeof core.provider.Provider> | undefined
    ) => {
      if (oldProvider) {
        oldProvider.off(core.base.EBaseEvent.UPDATE, handleUpdate);
        oldProvider.manager.off(core.base.EBaseEvent.UPDATE, handleUpdate);
      }

      if (newProvider) {
        newProvider.on(core.base.EBaseEvent.UPDATE, handleUpdate);
        newProvider.manager.on(core.base.EBaseEvent.UPDATE, handleUpdate);
        handleUpdate();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    if (_provider.value) {
      _provider.value.off(core.base.EBaseEvent.UPDATE, handleUpdate);
      _provider.value.manager.off(core.base.EBaseEvent.UPDATE, handleUpdate);
    }
  });

  return {
    config: _config,
    provider,
    actions,
    session,
    accounts,
    chains,
    chain,
    setChain: setActiveChain,
    uri,
    api: computed(() => _provider.value?.api),
    self: _provider,
  };
}
