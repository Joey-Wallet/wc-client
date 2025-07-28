'use client';
import React, { useState } from 'react';

import { Switch } from '../../ui/switch';
import type wc from '@joey-wallet/wc-client/react';
import utils from '@joey-wallet/wc-client/utils';
import core from '@joey-wallet/wc-client/core';

import { FormRenderProps as Props } from '~/components/template/form-hook';
import useUnifiedProvider from '~/hooks/useUnifiedProvider';
import { useStore } from '~/lib/zustand';

export const Index = (props: Props) => {
  const { provider, session, actions, self, chain, accounts } = useUnifiedProvider();
  const { account, setAccount } = useStore();

  const [response, setResponse] = React.useState<string | undefined>();
  const [isAutofill, setIsAutofill] = useState(false);
  const [isSubmit, setIsSubmit] = useState(true);

  const handleDisconnect = async () => {
    if (!session) throw new Error('session not found');
    setResponse(undefined);
    await actions.disconnect();
  };

  const testTransaction = async () => {
    try {
      if (!session || !provider || !account) throw new Error('session not found');
      const response = await core.methods.signTransaction({
        provider,
        chainId: chain,
        request: {
          tx_json: {
            TransactionType: 'AccountSet',
            Account: account?.split(':')[2] as string,
          },
          options: { autofill: isAutofill, submit: isSubmit },
        },
      });

      setResponse(JSON.stringify(response));
    } catch (e: any) {
      console.error(e);
      if (e.message) setResponse(e.message);
      console.error(`error: ${e}`);
    }
  };

  const testForTransaction = async () => {
    try {
      if (!session || !provider || !account) throw new Error('session not found');
      const response = await core.methods.signTransactionFor({
        provider,
        chainId: chain,
        request: {
          tx_signer: account?.split(':')[2] ?? '',
          tx_json: {
            TransactionType: 'AccountSet',
            Account: account?.split(':')[2] as string,
          },
          options: { autofill: isAutofill, submit: isSubmit },
        },
      });
      setResponse(JSON.stringify(response));
    } catch (e: any) {
      console.error(e);
      if (e.message) setResponse(e.message);
      console.error(`error: ${e}`);
    }
  };

  const testBulkTransaction = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      if (!session || !provider || !account) throw new Error('session not found');
      const response = await core.methods.signTransactionBatch({
        provider,
        chainId: chain,
        request: {
          txns: [
            {
              TransactionType: 'AccountSet',
              Account: account?.split(':')[2] as string,
            },
            {
              TransactionType: 'AccountSet',
              Account: account?.split(':')[2] as string,
            },
          ],
          options: { autofill: isAutofill, submit: isSubmit },
        },
      });
      setResponse(JSON.stringify(response));
    } catch (e: any) {
      console.error(e);
      if (e.message) setResponse(e.message);
      console.error(`error: ${e}`);
    }
  };

  return (
    <form className="flex flex-col justify-start gap-5 pt-3">
      <div className="flex w-full items-center gap-3">
        <div className="text-xl font-bold grow">Session Details</div>
        <div className="flex gap-2">
          <div>Submit</div>
          <Switch checked={isSubmit} onCheckedChange={setIsSubmit} />
        </div>
        <div className="flex gap-2">
          <div>Autofill</div>
          <Switch checked={isAutofill} onCheckedChange={setIsAutofill} />
        </div>
      </div>
      <button
        type="button"
        data-variant="Red"
        className={`
                p-2 px-5
                bg-color8
                border-color8
                hover:bg-color7
                border-2
                rounded-md
                hover:cursor-pointer
            `}
        onClick={handleDisconnect}>
        Disconnect
      </button>

      {session && accounts && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="flds-typography-typography-heading-h6-semibold grow p-1">Accounts</div>
            <div className="border-b w-full border-color8"></div>
          </div>

          <div>
            {accounts.map((a, index) => (
              <div
                key={index}
                className={`${a === account ? `text-color12` : `text-color11 opacity-30`} cursor-pointer`}
                onClick={() => setAccount(a)}>
                {a}
              </div>
            ))}
          </div>
        </div>
      )}

      {session && accounts && (
        <div className="flex flex-col gap-2">
          <div>
            <div className="flds-typography-typography-heading-h6-semibold grow p-1">Methods</div>
            <div className="border-b w-full border-color4"></div>
          </div>

          <button
            type="button"
            className={`
                    p-2 px-5
                    bg-color3
                    border-color3
                    border-2
                    rounded-md
                    hover:cursor-pointer
                                        hover:bg-color4
                  `}
            onClick={testTransaction}>
            Sign Transaction
          </button>

          <button
            type="button"
            className={`
                     p-2 px-5
                    bg-color3
                    border-color3
                    border-2
                    rounded-md
                    hover:cursor-pointer
                                        hover:bg-color4
                  `}
            onClick={testForTransaction}>
            Sign For Transaction
          </button>

          <button
            type="button"
            className={`
                     p-2 px-5
                    bg-color3
                    border-color3
                    border-2
                    rounded-md
                    hover:cursor-pointer
                    hover:bg-color4
                  `}
            onClick={testBulkTransaction}>
            Sign Bulk Transaction
          </button>
        </div>
      )}

      {response && (
        <>
          <div>
            <div className="flds-typography-typography-heading-h6-semibold grow p-1">Response</div>
            <div className="border-b w-full border-color4"></div>
          </div>
          <div
            className={`
              p-2 border-2 border-color3
              text-color12
              bg-color2
              overflow-hidden overflow-x-scroll w-full rounded-md`}>
            {response}
          </div>
        </>
      )}
    </form>
  );
};
