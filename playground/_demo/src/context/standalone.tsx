'use client';

import * as React from 'react';
import { standalone } from '@joey-wallet/wc-client/react';

import config from '~/common/wc-config';
import { useStore } from '~/lib/zustand';

// Remove custom storage from configuration
const { storage, ...stripped } = config;

const { Provider: _Provider, useProvider } = standalone.default;
export { useProvider };

export const Provider = (props: React.PropsWithChildren) => {
  const { metadata, projectId } = useStore();

  const _config = React.useMemo(
    () => Object.assign(stripped, { metadata, projectId }),
    [metadata, projectId]
  );

  return <_Provider config={_config}>{props.children}</_Provider>;
};

export default { Provider, useProvider };
