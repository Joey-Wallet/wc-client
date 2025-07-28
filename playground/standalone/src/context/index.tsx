'use client';

import * as React from 'react';
import { standalone } from '@joey-wallet/wc-client/react';

const { Provider, useProvider } = standalone.default;
export { useProvider };

const config = {
  projectId: 'YOUR_WALLETCONNECT_PROJECT_ID', // Obtain from https://cloud.reown.com
};

const JoeyProvider = (props: React.PropsWithChildren) => (
  <Provider config={config}>{props.children}</Provider>
);

JoeyProvider.displayName = 'JoeyProvider';
export default JoeyProvider;
