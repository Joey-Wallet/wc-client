<template>
  <div
    data-theme="Light"
    data-variant="Default"
    class="min-h-screen w-full bg-color2 text-color12 flex flex-col">
    <SplashScreen />
    <!-- Theme Toggle -->
    <div class="fixed top-4 right-4 z-1000">
      <button
        @click="toggleTheme"
        class="px-3 py-2 text-sm bg-color1 border border-color6 rounded-lg cursor-pointer transition-all duration-200 shadow-sm hover:bg-color3 hover:-translate-y-0.5 hover:shadow-md">
        {{ isDark ? '🌞' : '🌙' }} {{ isDark ? 'Light' : 'Dark' }} Mode
      </button>
    </div>

    <div
      class="w-full flex-1 flex flex-col justify-start items-center bg-color2 overflow-y-auto p-4">
      <div class="w-full flex flex-col justify-start items-center text-color12">
        <div class="max-w-lg mx-auto p-6 flex flex-col items-center justify-start py-8">
          <!-- Joey Logo -->
          <div class="flex justify-center items-center mb-6">
            <div class="h-16 w-16">
              <img
                src="/assets/joey-primary.png"
                alt="Joey Wallet"
                class="h-full w-full object-contain" />
            </div>
          </div>

          <h1 class="text-4xl font-bold mb-6 text-color12 text-center">Joey WalletConnect Demo</h1>

          <!-- Provider Selection -->
          <div
            class="bg-color1 rounded-lg p-6 border border-color6 mb-4 shadow-sm w-full max-w-md transition-all duration-300">
            <h2 class="text-xl font-semibold mb-4 text-color12">Select Provider Mode</h2>
            <div class="flex gap-4 mb-4">
              <button
                @click="providerMode = 'advanced'"
                :class="[
                  'rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer',
                  providerMode === 'advanced'
                    ? 'bg-color12 text-color1 border-color12'
                    : 'bg-color1 text-color12 border-color6 hover:bg-color3 hover:border-color8',
                ]">
                Advanced Provider
              </button>
              <button
                @click="providerMode = 'standalone'"
                :class="[
                  'rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer',
                  providerMode === 'standalone'
                    ? 'bg-color12 text-color1 border-color12'
                    : 'bg-color1 text-color12 border-color6 hover:bg-color3 hover:border-color8',
                ]">
                Standalone Provider
              </button>
            </div>
          </div>

          <!-- Advanced Provider Demo -->
          <WalletConnectProvider v-if="providerMode === 'advanced'" :config="walletConfig">
            <AdvancedDemo />
          </WalletConnectProvider>
          <WalletConnectProvider v-if="providerMode === 'standalone'" :config="walletConfig">
            <StandaloneDemo />
          </WalletConnectProvider>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { WalletConnectProvider } from '@joey-wallet/wc-vue';
import type { ProviderConfig } from '@joey-wallet/wc-vue';
import AdvancedDemo from './components/AdvancedDemo.vue';
import StandaloneDemo from './components/StandaloneDemo.vue';
import SplashScreen from './components/SplashScreen.vue';

type ProviderMode = 'advanced' | 'standalone';

const providerMode = ref<ProviderMode>('advanced');
const isDark = ref(false);

// Theme functionality
const toggleTheme = () => {
  isDark.value = !isDark.value;
  updateTheme();
};

const updateTheme = () => {
  const theme = isDark.value ? 'Dark' : 'Light';
  document.documentElement.setAttribute('data-theme', theme);
  document.documentElement.setAttribute('data-variant', 'Default');
  localStorage.setItem('theme', theme);
};

// Initialize theme on mount
onMounted(() => {
  const savedTheme = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

  isDark.value = savedTheme === 'Dark' || (!savedTheme && prefersDark);
  updateTheme();
});

// WalletConnect configuration
const walletConfig: ProviderConfig = {
  projectId: 'YOUR_WALLET_CONNECT_PROJECT_ID', // Replace with your actual project ID
  metadata: {
    name: 'Vue WalletConnect Demo',
    description: 'Demo app for Vue WalletConnect integration',
    url: 'http://localhost:3001',
    icons: ['https://walletconnect.com/walletconnect-logo.png'],
  },
  verbose: true,
};
</script>
