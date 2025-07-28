import type { IContext } from '~/common';
import type * as xrpl from 'xrpl';

import * as constants from '~/common/constants';

export interface TRequest {
  tx_signer: string;
  tx_json: xrpl.Transaction;
  options?: { autofill?: boolean; submit?: boolean };
}

export interface TResponse {
  tx_json: xrpl.TransactionAndMetadata;
}

const methods = constants.chains.xrpl.DEFAULT_METHODS;
export const method = methods.XRPL_SIGN_TRANSACTION_FOR;

export default (opts: { request: TRequest } & IContext) => {
  const { provider, chainId } = opts;
  const { tx_signer, tx_json, ...options } = opts.request;

  return provider.request<TResponse>(
    {
      method,
      params: {
        tx_signer,
        tx_json,
        ...options,
      },
    },
    chainId
  );
};
