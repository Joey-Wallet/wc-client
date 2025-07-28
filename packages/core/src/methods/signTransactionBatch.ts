import type { IContext } from '~/common';
import type * as xrpl from 'xrpl';

import * as constants from '~/common/constants';

export interface TRequest {
  txns: xrpl.Transaction[];
  fee?: xrpl.Payment;
  includesFee?: boolean;
  options?: { autofill?: boolean; submit?: boolean };
}

export interface TResponse {
  txns: xrpl.TransactionAndMetadata[];
}

const methods = constants.chains.xrpl.DEFAULT_METHODS;
export const method = methods.XRPL_SIGN_TRANSACTION_BATCH;

export default (opts: { request: TRequest } & IContext) => {
  const { provider, chainId } = opts;
  const { txns, fee, ...options } = opts.request;

  return provider.request<TResponse>(
    {
      method,
      params: {
        txns,
        fee,
        ...options,
      },
    },
    chainId
  );
};
