<template>
  <slot />
</template>

<script setup lang="ts">
import { provide, defineProps, watchEffect, ref } from 'vue';
import { useWalletConnect } from '~/composables/useWalletConnect';
import * as typings from '~/typings';

interface Props {
  config: typings.ProviderConfig;
}

const props = defineProps<Props>();

// Create a reactive reference for the wallet context
const walletConnectContext = ref<typings.IContext | null>(null);

// Watch for config changes and initialize WalletConnect when config is available
watchEffect(async () => {
  console.log('props.config:', props.config);

  if (props.config) {
    try {
      const context = useWalletConnect(props.config);
      walletConnectContext.value = context as typings.IContext;
      if (walletConnectContext.value) {
        provide(typings.WALLET_CONNECT_CONTEXT_KEY, walletConnectContext.value);
      }
    } catch (error) {
      console.error('Failed to initialize WalletConnect:', error);
    }
  }
});
</script>
