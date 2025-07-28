'use client';

import config from '~/common/wc-config';
import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';

import { SignClientTypes } from '@walletconnect/types';

export interface Store {
  activeNetwork: string | undefined;
  setActiveNetwork: (network: string | undefined) => void;
  metadata: SignClientTypes.Metadata | undefined;
  setMetadata: (metadata: SignClientTypes.Metadata | undefined) => void;
  projectId: string;
  setProjectId: (id: string) => void;
  account?: string;
  setAccount: (account?: string) => void;
  type: 'advanced' | 'standalone';
  setType: (type: 'advanced' | 'standalone') => void;
  theme: 'Light' | 'Dark';
  setTheme: (theme: 'Light' | 'Dark') => void;
  toggleTheme: () => void;
}

const getStorage = (): StateStorage => {
  if (typeof window !== 'undefined') {
    console.log('[useFormNavigation] Using localStorage');
    return {
      getItem: async (name: string): Promise<string | null> => {
        return localStorage.getItem(name);
      },
      setItem: async (name: string, value: string): Promise<void> => {
        localStorage.setItem(name, value);
      },
      removeItem: async (name: string): Promise<void> => {
        localStorage.removeItem(name);
      },
    };
  }
  console.log('[useFormNavigation] Using SSR fallback storage');
  return {
    getItem: async (_name: string): Promise<string | null> => null,
    setItem: async (_name: string, _value: string): Promise<void> => {},
    removeItem: async (_name: string): Promise<void> => {},
  };
};

export const useStore = create<Store>()(
  persist(
    (set, get) => ({
      // Network state
      activeNetwork: undefined,
      setActiveNetwork: (network) => set({ activeNetwork: network }),

      // ProjectId state
      projectId: config.projectId,
      setProjectId: (id) => set({ projectId: id }),

      // ProjectId state
      account: undefined,
      setAccount: (account) => set({ account }),

      // Metadata state
      metadata: config.metadata,
      setMetadata: (metadata) => set({ metadata }),

      // Type state
      type: 'advanced',
      setType: (type) => set({ type }),

      // Theme state
      theme: 'Light',
      setTheme: (theme) => set({ theme }),
      toggleTheme: () => set({ theme: get().theme === 'Light' ? 'Dark' : 'Light' }),
    }),
    {
      name: 'storage',
      storage: createJSONStorage(getStorage),
    }
  )
);
