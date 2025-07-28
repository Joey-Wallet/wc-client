import type { SessionTypes } from '@walletconnect/types';
import type Provider from '@walletconnect/universal-provider';

export type TSession = SessionTypes.Struct;

export interface IContext {
  provider: Provider;
  chainId: string;
}

export interface IMethodConditional {
  sessionId: string;
  chainId: string;
}
