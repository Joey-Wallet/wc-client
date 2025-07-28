'use client';

import * as React from 'react';
import { useProvider } from './page';

export default function Main() {
  const { actions, session, accounts } = useProvider();

  const handleConnect = async () => {
    const connect = await actions.connect();
    if (connect.error) throw connect.error;
    // You have been connected using wallet connect.
    // Now you can start interacting with the XRP Ledger.
    // ...
  };

  return (
    <div>
      {!session && (
        <button type="button" onClick={handleConnect}>
          Connect
        </button>
      )}
      {session && (
        <div>
          Successfully connected!
          {accounts && accounts.map((account) => <div>{account}</div>)}
        </div>
      )}
    </div>
  );
}
