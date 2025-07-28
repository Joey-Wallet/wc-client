'use client';

import * as advanced from '~/context/advanced';
import * as standalone from '~/context/standalone';

import { useStore } from '~/lib/zustand';
import { useMemo } from 'react';

export const useUnifiedProvider = () => {
  const { type } = useStore();

  const provider = useMemo(
    () => (type === 'standalone' ? standalone.useProvider : advanced.useProvider),
    [type]
  );

  return provider();
};

export default useUnifiedProvider;
