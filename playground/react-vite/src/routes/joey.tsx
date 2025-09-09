'use client';

import { createFileRoute, useRouter } from '@tanstack/react-router';

import * as React from 'react';
import core from '@joey-wallet/wc-client/core';
import type * as xrpl from 'xrpl';

import { useProvider } from '~/context/wcProvider';

export const Route = createFileRoute('/joey')({
  component: RouteComponent,
});

function RouteComponent() {
  const { provider, session, chain, accounts, actions } = useProvider();
  const [response, setResponse] = React.useState<string | undefined>();
  const router = useRouter();

  const handleConnect = async () => {
    const connect = await actions.connect();
    if (connect.error) throw connect.error;
    // You have been connected using wallet connect.
    // Now you can start interacting with the XRP Ledger.
    // ...
    console.log('Connected!');
  };

  const handleSign = async () => {
    try {
      if (!provider) throw Error('Provider not ready for request.');

      const address = accounts?.map((account) => account.replace(chain, ''))?.[0];
      if (!address) throw Error('Could not determine address for request');

      const tx_json: xrpl.Payment = {
        TransactionType: 'Payment',
        Account: address,
        Destination: 'ra5nK24KXen9AHvsdFTKHSANinZseWnPcX',
        Amount: {
          currency: 'USD',
          value: '1',
          issuer: 'rf1BiGeXwwQoi8Z2ueFYTEXSwuJYfV2Jpn',
        },
        Fee: '12',
        Flags: 2147483648,
        Sequence: 2,
      };

      const response = await core.methods.signTransaction({
        provider,
        chainId: chain,
        request: {
          tx_json,
          options: { autofill: true, submit: true },
        },
      });

      setResponse(JSON.stringify(response, null, 2));
    } catch (e: any) {
      console.error(e);
      return new Error(e.message);
    }
  };

  const handleDisconnect = () => actions.disconnect();

  return (
    <div>
      {session && (
        <button type="button" onClick={handleSign}>
          Submit
        </button>
      )}
      {session && (
        <button type="button" className="disconnect" onClick={handleDisconnect}>
          Disconnect
        </button>
      )}
      {response && (
        <div>
          <span>Received a response from Joey Wallet!</span>
          {response}
        </div>
      )}
      {!session && (
        <button type="button" onClick={handleConnect}>
          Connect
        </button>
      )}
    </div>
  );
}
