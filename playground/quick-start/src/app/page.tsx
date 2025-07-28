// File: ./src/app/page.tsx

import * as React from 'react';
import Main from './main';

export const metadata = {
  title: 'Main - My XRPL App',
  description: 'Sign transactions securely with XRPL integration',
};

export default function Page() {
  return <Main />;
}
