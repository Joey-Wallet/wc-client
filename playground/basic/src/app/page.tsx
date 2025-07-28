'use client';

import * as React from 'react';
import { advanced } from '@joey-wallet/wc-client/react';

import config from '~/config';
import Main from './main';

const { Provider: WcProvider, useProvider } = advanced.default;
export { useProvider };

export const Provider = (props: React.PropsWithChildren) => (
  <WcProvider config={config}>{props.children}</WcProvider>
);

export default function Page() {
  return (
    <Provider>
      <Main />
    </Provider>
  );
}
