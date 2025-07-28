import type { IContext } from '~/common';
import type * as xrpl from 'xrpl';

import * as constants from '~/common/constants';

export interface TRequest {
  tx_json: xrpl.Transaction;
  fee: xrpl.Payment;
  options?: { autofill?: boolean; submit?: boolean };
}

export interface TResponse {
  txns: xrpl.TransactionAndMetadata[];
}

const methods = constants.chains.xrpl.DEFAULT_METHODS;
export const method = methods.XRPL_SIGN_TRANSACTION_FEE;

export default (opts: { request: TRequest } & IContext) => {
  const { provider, chainId } = opts;
  const { tx_json, fee, ...options } = opts.request;

  return provider.request<TResponse>(
    {
      method,
      params: {
        tx_json,
        fee,
        ...options,
      },
    },
    chainId
  );
};
