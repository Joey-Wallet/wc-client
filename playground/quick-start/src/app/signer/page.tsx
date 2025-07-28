// File: ./src/app/signer/page.tsx
import * as React from 'react';
import Signer from './signer';

export const metadata = {
  title: 'Signer - My XRPL App',
  description: 'Sign transactions securely with XRPL integration',
};

export default function Page() {
  return <Signer />;
}
