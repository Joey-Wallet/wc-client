import { inject } from 'vue';
import * as typings from '~/typings';

export function useWalletConnectProvider() {
  const context = inject(typings.WALLET_CONNECT_CONTEXT_KEY);

  if (!context) {
    throw new Error(
      'useWalletConnectProvider must be used within a WalletConnectProvider. ' +
        'Make sure to wrap your component with <WalletConnectProvider>.'
    );
  }

  return context;
}
