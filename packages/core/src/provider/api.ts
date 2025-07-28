import * as kit from '@joey-wallet/wc-utils';
import type { SessionsMap } from '~/root';

import type * as common from '~/common';

import type { Index as Manager } from '~/manager';
import * as methods from '~/methods';

export type Opts = common.Opts & { manager: Manager; sessions: SessionsMap };

export class Index {
  opts: Opts;
  logger: kit.Logger;

  manager: Manager;
  sessions: SessionsMap;

  constructor(opts: Opts) {
    this.opts = opts;
    this.logger = new kit.Logger({ verbose: Boolean(this.opts.verbose) });

    this.manager = this.opts.manager;
    this.sessions = this.opts.sessions;
  }

  findSession = (topic: string) => {
    const session = this.sessions.get(topic);
    if (!session) {
      this.logger.info(this.sessions.values());
      throw new Error('No active session found.');
    }

    return session;
  };

  protected precondition = async (opts: common.IMethodConditional) => {
    const { sessionId, chainId } = opts;
    const session = this.findSession(sessionId);
    this.logger.info(session);

    const mount = await this.manager.mount();
    if (mount.error) throw new Error('WalletConnect is not initialized');

    if (!session.chains.includes(chainId))
      throw new Error('This chain is not found on the session.');

    this.logger.obj.info({
      msg: 'Sending request to wallet',
      chainId,
      topic: session.topic,
    });

    return { provider: mount.data, session };
  };

  signTransaction = (payload: methods.sign.TRequest, opts: common.IMethodConditional) =>
    kit.asyncCatch(async () => {
      const { chainId } = opts;
      this.logger.info('Handling sign payload request');
      return this.precondition(opts).then(({ provider }) =>
        methods.signTransaction({ request: payload, provider, chainId })
      );
    });

  signTransactionFor = (payload: methods.signFor.TRequest, opts: common.IMethodConditional) =>
    kit.asyncCatch(async () => {
      const { chainId } = opts;
      this.logger.info('Handling signFor payload request');
      return this.precondition(opts).then(({ provider }) =>
        methods.signTransactionFor({ request: payload, provider, chainId })
      );
    });

  signTransactionBatch = (payload: methods.signBatch.TRequest, opts: common.IMethodConditional) =>
    kit.asyncCatch(async () => {
      const { chainId } = opts;
      this.logger.info('Handling signBatch payload request');
      return this.precondition(opts).then(({ provider }) =>
        methods.signTransactionBatch({ request: payload, provider, chainId })
      );
    });

  signTransactionFee = (payload: methods.signFee.TRequest, opts: common.IMethodConditional) =>
    kit.asyncCatch(async () => {
      const { chainId } = opts;
      this.logger.info('Handling signBatch payload request');
      return this.precondition(opts).then(({ provider }) =>
        methods.signTransactionFee({ request: payload, provider, chainId })
      );
    });
}
