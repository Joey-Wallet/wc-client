<template>
  <div v-if="isReady">
    <slot />
  </div>
  <div v-else-if="error" class="error">Error: {{ error }}</div>
  <div v-else>Loading WalletConnect...</div>
</template>

<script setup lang="ts">
import { provide, watchEffect, ref } from 'vue';
import { useWalletConnect } from '~/composables/useWalletConnect';
import * as typings from '~/typings';

interface Props {
  config: typings.ProviderConfig;
}

const props = defineProps<Props>();

const isReady = ref(false);
const error = ref<string | null>(null);
let walletConnectContext: typings.IContext | null = null;

watchEffect(async () => {
  // Reset state
  isReady.value = false;
  error.value = null;

  // Check if config exists and is valid
  if (!props?.config) {
    console.warn('WalletConnect config is not available');
    return;
  }

  try {
    console.log('Initializing WalletConnect with config:', props.config);
    const context = useWalletConnect(props.config);
    walletConnectContext = context as typings.IContext;
    
    if (walletConnectContext) {
      isReady.value = true;
    }
  } catch (err) {
    console.error('WalletConnect initialization failed:', err);
    error.value = err instanceof Error ? err.message : 'Unknown error';
  }
});

// Initialize context immediately during setup
if (props?.config) {
  try {
    console.log('Initializing WalletConnect with config:', props.config);
    const context = useWalletConnect(props.config);
    walletConnectContext = context as typings.IContext;
    provide(typings.WALLET_CONNECT_CONTEXT_KEY, walletConnectContext);
    isReady.value = true;
  } catch (err) {
    console.error('WalletConnect initialization failed:', err);
    error.value = err instanceof Error ? err.message : 'Unknown error';
  }
}
</script>
