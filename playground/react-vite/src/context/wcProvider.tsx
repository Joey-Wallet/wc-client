'use client';

import * as React from 'react';
import { advanced } from '@joey-wallet/wc-client/react';

import config from '~/config/wc-config';

const { Provider: _Provider, useProvider } = advanced.default;
export { useProvider };

export const Provider = (props: React.PropsWithChildren) => {
  return <_Provider config={config}>{props.children}</_Provider>;
};

export default { Provider, useProvider };
