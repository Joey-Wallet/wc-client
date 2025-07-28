// File: ./src/app/main.tsx
'use client';

import * as React from 'react';
import { useProvider } from './layout';
import { useRouter } from 'next/navigation';

export default function Component() {
  const { actions, session, accounts } = useProvider();
  const router = useRouter();

  const handleConnect = async () => {
    const connect = await actions.connect();
    if (connect.error) throw connect.error;
    // You have been connected using wallet connect.
    // Now you can start interacting with the XRP Ledger.
    // ...
    console.log('Connected!');
    router.push('/signer');
  };

  React.useEffect(() => {
    if (session) router.push('/signer');
  }, [session]);

  return (
    <div>
      {!session && (
        <button type="button" onClick={handleConnect}>
          Connect
        </button>
      )}
      {session && (
        <div>
          <span>Successfully connected!</span>
          {accounts && accounts.map((account, index) => <div key={index}>{account}</div>)}
        </div>
      )}
    </div>
  );
}
