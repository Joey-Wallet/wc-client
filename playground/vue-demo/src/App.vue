<template>
  <div class="container">
    <h1>WalletConnect Vue 3 Demo</h1>

    <!-- Provider Selection -->
    <div class="card">
      <h2>Select Provider Mode</h2>
      <div style="margin: 1rem 0; display: flex; gap: 1rem">
        <button @click="providerMode = 'advanced'" :class="{ active: providerMode === 'advanced' }">
          Advanced Provider
        </button>
        <button
          @click="providerMode = 'standalone'"
          :class="{ active: providerMode === 'standalone' }">
          Standalone Provider
        </button>
      </div>
    </div>

    <!-- Advanced Provider Demo -->
    <WalletConnectProvider v-if="providerMode === 'advanced'" :config="walletConfig">
      <AdvancedDemo />
    </WalletConnectProvider>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { WalletConnectProvider } from '@joey-wallet/wc-vue';
import type { ProviderConfig } from '@joey-wallet/wc-vue';
import AdvancedDemo from './components/AdvancedDemo.vue';

type ProviderMode = 'advanced' | 'standalone';

const providerMode = ref<ProviderMode>('advanced');

// WalletConnect configuration
const walletConfig: ProviderConfig = {
  projectId: 'YOUR_PROJECT_ID_GOES_THERE', // Replace with your actual project ID
  metadata: {
    name: 'Vue WalletConnect Demo',
    description: 'Demo app for Vue WalletConnect integration',
    url: 'http://localhost:3001',
    icons: ['https://walletconnect.com/walletconnect-logo.png'],
  },
  verbose: true,
};
</script>
