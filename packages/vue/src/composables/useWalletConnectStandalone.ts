import { computed, onMounted, onUnmounted, ref, watch } from 'vue';

import UniversalProvider from '@walletconnect/universal-provider';

import * as utils from '@joey-wallet/wc-utils';
import * as core from '@joey-wallet/wc-core';

import type * as typings from '~/typings';
import { ProviderEvents } from '~/typings';

export function useWalletConnectStandalone(config: typings.ProviderConfig) {
  const _config = computed(() => core.utils.configBuilder(config));
  const logger = computed(() => new utils.Logger({ verbose: Boolean(config.verbose) }));

  const isMounted = ref(false);
  const provider = ref<UniversalProvider>();
  const chains = ref<string[]>();
  const accounts = ref<string[]>();
  const chain = ref<string>(_config.value.defaultChain);
  const session = ref<typings.TSession>();
  const uri = ref<string>();

  const initialize = async () => {
    try {
      logger.value.info('INFO', 'initializing new provider...');
      logger.value.info('INFO', `${_config.value.projectId}`);

      if (provider.value) {
        logger.value.info('INFO', 'Destroying existing provider...');
        await actions.value.disconnect();
        provider.value = undefined;
      }

      const newProvider = await UniversalProvider.init({
        projectId: _config.value.projectId,
        metadata: core.utils.general.buildMetadata(_config.value),
        logger: _config.value.verbose ? undefined : 'silent',
        storage: core.utils.general.handleStorage(_config.value),
      });
      provider.value = newProvider;
    } catch (error) {
      logger.value.error('Provider initialization failed:', error);
    }
  };

  const loadPersistedData = () => {
    logger.value.info('INFO', 'loading persisted data...');
    uri.value = provider.value?.uri;
    session.value = provider.value?.session;
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
    if (provider.value && session.value) {
      provider.value.disconnect();
      reset();
    }
    chain.value = newChain;
  };

  const subscribeToEvents = () => {
    if (!provider.value) return;

    logger.value.info('subscribeToEvents...');

    const record = (event: string) => logger.value.info('Subscription Event', event);

    provider.value.on(ProviderEvents.CONNECT, () => {
      record(ProviderEvents.CONNECT);
      loadPersistedData();
    });

    provider.value.on(ProviderEvents.URI, () => {
      record(ProviderEvents.URI);
      loadPersistedData();
    });

    provider.value.on(ProviderEvents.DELETE, () => {
      record(ProviderEvents.DELETE);
      loadPersistedData();
    });

    provider.value.on(ProviderEvents.PROVIDER_CONNECT, () => {
      record(ProviderEvents.PROVIDER_CONNECT);
      loadPersistedData();
    });

    provider.value.on(ProviderEvents.PROVIDER_DISCONNECT, () => {
      record(ProviderEvents.PROVIDER_DISCONNECT);
      reset();
    });

    provider.value.on(ProviderEvents.PROVIDER_ERROR, () => {
      record(ProviderEvents.PROVIDER_ERROR);
    });

    provider.value.on(ProviderEvents.REQUEST_SENT, () => record(ProviderEvents.REQUEST_SENT));

    provider.value.on(ProviderEvents.UPDATE, () => {
      record(ProviderEvents.UPDATE);
      loadPersistedData();
    });

    provider.value.on(ProviderEvents.PING, () => record(ProviderEvents.PING));

    provider.value.on(ProviderEvents.EVENT, () => record(ProviderEvents.EVENT));

    provider.value.on(ProviderEvents.EXPIRE, () => {
      record(ProviderEvents.EXPIRE);
      reset();
    });
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
    loadPersistedData();
    return result;
  };

  const connect = async (opts: Partial<core.typings.ConnectionOpts> = {}) => {
    if (!provider.value) throw new Error('Provider is not initialized');
    const _opts = {
      provider: provider.value,
      chain: chain.value,
      logger: logger.value,
      ..._config.value,
      ...opts,
    };

    const result = await core.utils.general.handleConnection(_opts);
    if (result.error) throw result.error;

    logger.value.info('updating active session..');
    chain.value = _opts.chain;
    session.value = result.data.response;
    return actionUpdate(result.data.response);
  };

  const reconnect = async (_session: typings.TSession) => {
    if (!provider.value) throw new Error('Provider is not initialized');
    await provider.value.connect({
      pairingTopic: _session.pairingTopic,
    });
    return actionUpdate(undefined);
  };

  const disconnect = async () => {
    if (!provider.value) throw new Error('Provider is not initialized');
    await provider.value.disconnect();
    return actionUpdate(undefined);
  };

  const generate = async (opts: Partial<core.typings.connect.IGenerateOpts> = {}) => {
    if (!provider.value) throw new Error('Provider is not initialized');
    const _opts = {
      provider: provider.value,
      chain: chain.value,
      logger: logger.value,
      ..._config.value,
      ...opts,
    };

    const _generate = await core.utils.connect.generateDetails(_opts);
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
    isMounted,
    (mounted: boolean) => {
      if (mounted) {
        initialize();
      }
    },
    { immediate: true }
  );

  watch(
    provider,
    (newProvider: UniversalProvider | undefined) => {
      if (newProvider) {
        loadPersistedData();
        subscribeToEvents();
      }
    },
    { immediate: true }
  );

  onUnmounted(() => {
    reset();
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
    api: computed(() => undefined),
    self: computed(() => undefined),
  };
}
