// File: ./src/app/signer.tsx
'use client';

import * as React from 'react';
import xrpl from 'xrpl';
import core from '@joey-wallet/wc-client/core';

import { useProvider } from '~/context';

export default function Signer() {
  const { provider, session, chain, accounts } = useProvider();
  const [response, setResponse] = React.useState<string | undefined>();

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
    } catch (e: unknown) {
      console.error(e);
      return e;
    }
  };

  return (
    <div>
      {session && (
        <button type="button" onClick={handleSign}>
          Submit
        </button>
      )}
      {response && (
        <div>
          <span>Received a response from Joey Wallet!</span>
          {response}
        </div>
      )}
    </div>
  );
}
