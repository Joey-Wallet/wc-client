import type { ProposalTypes, SignClientTypes, Verify } from '@walletconnect/types';
import type { IStrictConfig } from '~/utils/config';

export type Opts = IStrictConfig;

export type TProposal = {
  verifyContext: Verify.Context;
} & Omit<SignClientTypes.BaseEventArgs<ProposalTypes.Struct>, 'topic'>;

export type TProposalHandler = (proposal: TProposal) => Promise<boolean>;

export type TRequestHandler<TFnExpectedResponse> = (
  request: TRequest
) => Promise<TFnExpectedResponse>;

export type TRequest = {
  verifyContext: Verify.Context;
} & SignClientTypes.BaseEventArgs<{
  request: {
    method: string;
    params: any;
    expiryTimestamp?: number;
  };
  chainId: string;
}>;

export interface TUserDefinedHandlers<TFnExpectedResponse> {
  onProposal?: TProposalHandler;
  onRequest?: TRequestHandler<TFnExpectedResponse>;
}
