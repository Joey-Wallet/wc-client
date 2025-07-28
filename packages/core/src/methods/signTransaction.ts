import type * as xrpl from 'xrpl';

import type { IContext } from '~/common';
import * as constants from '~/common/constants';

const tx_json = {
  TransactionType: 'Batch',
  Account: 'rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b',
  Flags: 65536,
  RawTransactions: [
    {
      RawTransaction: {
        TransactionType: 'OfferCreate',
        Flags: 1073741824,
        Account: 'rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b',
        TakerGets: '6000000',
        TakerPays: {
          currency: 'GKO',
          issuer: 'ruazs5h1qEsqpke88pcqnaseXdm6od2xc',
          value: '2',
        },
        Sequence: 4,
        Fee: '0',
        SigningPubKey: '',
      },
    },
    {
      RawTransaction: {
        TransactionType: 'Payment',
        Flags: 1073741824,
        Account: 'rUserBSM7T3b6nHX3Jjua62wgX9unH8s9b',
        Destination: 'rDEXfrontEnd23E44wKL3S6dj9FaXv',
        Amount: '1000',
        Sequence: 5,
        Fee: '0',
        SigningPubKey: '',
      },
    },
  ],
  Sequence: 3,
  Fee: '40',
  SigningPubKey: '022D40673B44C82DEE1DDB8B9BB53DCCE4F97B27404DB850F068DD91D685E337EA',
  TxnSignature:
    '3045022100EC5D367FAE2B461679AD446FBBE7BA260506579AF4ED5EFC3EC25F4DD1885B38022018C2327DB281743B12553C7A6DC0E45B07D3FC6983F261D7BCB474D89A0EC5B8',
};

export interface TRequest {
  tx_json: xrpl.Transaction;
  fee?: xrpl.Payment;
  includesFee?: boolean;
  options?: { autofill?: boolean; submit?: boolean };
}

export interface TResponse {
  tx_json: xrpl.TransactionAndMetadata;
}

const methods = constants.chains.xrpl.DEFAULT_METHODS;
export const method = methods.XRPL_SIGN_TRANSACTION;

export default (opts: { request: TRequest } & IContext) => {
  const { provider, chainId } = opts;
  const { tx_json, ...options } = opts.request;

  return provider.request<TResponse>(
    {
      method,
      params: {
        tx_json,
        ...options,
      },
    },
    chainId
  );
};
