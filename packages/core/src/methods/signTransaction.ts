import type * as xrpl from 'xrpl';

import type { IContext } from '~/common';
import * as constants from '~/common/constants';

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
