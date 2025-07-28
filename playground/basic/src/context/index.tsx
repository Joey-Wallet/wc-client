'use client';

import * as React from 'react';
import { standalone } from '@joey-wallet/wc-client/react';
import { Config } from '@joey-wallet/wc-client';

const { Provider, useProvider } = standalone.default;
export { useProvider };

const config: Config = {
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID',
};

const JoeyProvider = (props: React.PropsWithChildren) => (
  <Provider config={config}>{props.children}</Provider>
);

JoeyProvider.displayName = 'JoeyProvider';
export default JoeyProvider;
