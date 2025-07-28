import * as kit from '@joey-wallet/wc-utils';

import * as api from './api';
import type * as common from '~/common';

import type { SessionTypes } from '@walletconnect/types';
import type * as typings from '~/typings';
import { Index as Session } from '~/session';
import { Root } from '~/root';

import * as utils from '~/utils';
import * as xrpl from '~/common/constants/chains/xrpl';
import { EProviderEvents } from '~/typings';

export type Opts = common.Opts;
export type Api = api.Index;
export { Session };

export class Provider extends Root<'wc-client'> {
  #opts: Opts;

  api: api.Index;

  chain = xrpl.mainnet.id;
  uri?: string;

  connectionArray: string[] = [];

  constructor(opts: Opts) {
    super(opts);
    this.#opts = opts;

    this.api = new api.Index({ ...opts, manager: this.manager, sessions: this.sessions });
  }

  setActiveChain = (chainId: string) => (this.chain = chainId);

  setUri = (uri: string) => {
    this.logger.info(`uri: ${uri}`);
    this.connectionArray.push(uri);
    this.uri = uri;
    this.notify();
  };

  connect = async (opts: typings.connect.IConnectOpts = {}) =>
    kit.promiseCatch(
      this.head()
        .then(async (provider) => {
          const _opts = Object.assign(
            {
              provider,
              chain: this.chain,
            },
            this.#opts,
            opts
          );

          const result = await utils.general.handleConnection(_opts);
          if (result.error) throw result.error;

          const session = result.data.response;
          this.sessions.set(
            session.topic,
            new Session({
              ...this.opts,
              manager: this.manager,
              session,
            })
          );

          this.uri = undefined;
          this.chain = _opts.chain;

          return result.data.response;
        })
        .then(this.tail)
    );

  generateConnectionDetails = async (opts: typings.connect.IGenerateOpts = {}) =>
    kit.promiseCatch(
      this.head()
        .then(async (provider) => {
          const _opts = Object.assign(
            {
              provider,
              chain: this.chain,
            },
            this.#opts,
            opts
          );

          const result = await utils.connect.generateDetails(_opts);
          if (result.error) throw result.error;

          this.uri = result.data.uri;
          this.chain = _opts.chain;

          return result.data;
        })
        .then(this.tail)
    );

  disconnect = (opts: { topic: string }) => this._findSession(opts.topic).disconnect();

  listenForConnect = async () =>
    new Promise((resolve, reject) => {
      // Listen for connect event to capture session and URI
      const onConnect = () => {
        resolve(true);
        // Clean up listener
        this.manager.provider?.off(EProviderEvents.CONNECT, onConnect);
      };

      // Handle provider errors
      const onError = () => {
        reject(new Error(`Failed to connect`));
        this.manager.provider?.off(EProviderEvents.CONNECT, onError);
      };

      // Register event listeners
      this.manager.provider?.on(EProviderEvents.CONNECT, onConnect);
      this.manager.provider?.on(EProviderEvents.CONNECT, onError);
    });

  protected _findSession = (topic: string) => {
    const session = this.sessions.get(topic);
    if (!session) {
      this.logger.info(this.sessions.values());
      throw new Error('No active session found.');
    }

    return session;
  };
}
