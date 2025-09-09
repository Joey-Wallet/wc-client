import * as kit from '@joey-wallet/wc-utils';

import * as store from './store';
import type { Index as Manager } from './manager';
import type { SessionTypes, SignClientTypes } from '@walletconnect/types';

import * as constants from '~/common/constants';

import * as methods from '~/methods';
import * as common from '~/common';
import * as utils from '~/utils';

export type TStoredMetadata = store.StoredMetadata;
export type TStoredRequest = store.StoredRequest;
export type TRequest = common.TRequest;

export type Opts = {
  session: { topic: string } & Partial<SessionTypes.Struct>;
  uri?: string;
  manager: Manager;
} & common.Opts;

export class Index extends common.base.Base<'Session'> {
  opts: Opts;
  logger: kit.Logger;

  id: string;
  topic: string;

  data: SessionTypes.Struct;

  accounts: string[] = [];
  chains: string[];

  methods: string[] = [];
  events: string[] = [];

  requests: Map<number, store.StoredRequest> = new Map();

  store?: {
    requests: ReturnType<typeof store.requests>;
    metadata: ReturnType<typeof store.metadata>;
  };

  status = false;
  pairing?: string;

  constructor(opts: Opts) {
    super(opts);
    this.opts = opts;
    this.logger = new kit.Logger({ verbose: Boolean(this.opts.verbose) });

    this.topic = this.opts.session.topic;
    this.data = this.opts.session as SessionTypes.Struct;
    this.id = this.topic;

    this.accounts = this._getAccounts();
    this.chains = this._getChains();
    this.methods = this._getMethods();
    this.events = this._getEvents();

    if (this.opts.storage?.custom)
      this.store = {
        requests: store.requests(this.opts.storage.custom),
        metadata: store.metadata(this.opts.storage.custom),
      };

    this.init();
  }

  protected _head = async () => {
    const mount = await this.opts.manager.mount();
    if (mount.error) throw mount.error;

    return mount.data;
  };

  protected _tail = async <T>(opts: T) => {
    await this.update();
    return this.tail(opts);
  };

  init = () =>
    kit.promiseCatch(
      this._head()
        .then(async () => {
          // Ensure that connection to the peer is re-established on reload
          this._getStatus().then((result) => {
            // If pairing is found and status is not active
            // Attemp reconnect
            if (result.data && result.data.session?.pairingTopic) this.reconnect();
          });

          this.store?.metadata.set(this.data.peer.metadata, this.topic);

          (await this.store?.requests.get.filter(this.topic))?.forEach((req) => {
            this.requests.set(req.id, req);
          });
        })
        .then(this.tail)
    );

  reconnect = () =>
    kit.promiseCatch(
      this._head()
        .then(async (provider) => {
          try {
            const session = await provider.pair(this.pairing);
            this.data = session;
            this.status = true;
            this.logger.info(`Session reconnected for topic: ${this.topic}`);
          } catch (error) {
            this.logger.error('Reconnection failed', error);
            throw error;
          }
        })
        .then(this.tail)
    );

  disconnect = () =>
    kit.promiseCatch(
      this._head().then((provider) =>
        provider
          .disconnect()
          .then(() => this.opts.manager.setData(provider))
          .then(this.tail)
      )
    );

  addRequest = (opts: TRequest) =>
    kit.asyncCatch(async () => {
      this.requests.set(opts.id, { ...opts, timestamp: Date.now() });
      this.store?.requests.set(Array.from(this.requests.values()), this.topic);
      return this._tail(this.requests);
    });

  update = () =>
    kit.promiseCatch(
      this._head().then(async () => {
        const status = await this._getStatus();

        this.pairing = status.data?.session?.pairingTopic;
        if (status.data?.session) this.data = status.data.session;
      })
    );

  protected _getStatus = () =>
    kit.promiseCatch(
      this._head().then((provider) => {
        const session = provider.session;
        return {
          session,
          namespaces: provider.namespaces,
          properties: provider.sessionProperties,
        };
      })
    );

  protected _getAccounts = () =>
    utils.session.getAllAccounts(this.opts.session as SessionTypes.Struct);

  protected _getChains = () => utils.session.getChains(this.opts.session as SessionTypes.Struct);

  protected _getMethods = () => utils.session.getMethods(this.opts.session as SessionTypes.Struct);

  protected _getEvents = () => utils.session.getEvents(this.opts.session as SessionTypes.Struct);

  protected _filter = (opts: { topic?: string }) =>
    new Promise((resolve, reject) => {
      const { topic } = opts;
      const isMatch = topic === this.topic;

      if (!isMatch) return reject('This event does not match the current session topic');
      return resolve(isMatch);
    });

  protected _handleEvent = (
    scope: string,
    opts: Omit<SignClientTypes.BaseEventArgs<unknown>, 'params'>
  ) =>
    kit.promiseCatch(
      this._filter(opts).then(() => {
        this.logger.info('EVENT', scope, opts);
      })
    );

  protected _handleExpire = (scope: string, opts: { topic: string }) =>
    kit.promiseCatch(
      this._filter(opts).then(() => {
        this.logger.info('EXPIRE', scope, opts);
      })
    );

  protected _handleUpdate = (
    scope: string,
    opts: SignClientTypes.BaseEventArgs<{
      namespaces: SessionTypes.Namespaces;
    }>
  ) =>
    kit.promiseCatch(
      this._filter(opts).then(() => {
        this.logger.info('EVENT', scope, opts);
        const { namespaces } = opts.params;

        this.data = { ...this.data, namespaces };
        this.chains = this._getChains();
        this.accounts = this._getAccounts();
      })
    );

  api = {
    signTransaction: (
      payload: methods.sign.TRequest,
      opts: Omit<common.IMethodConditional, 'sessionId'>
    ) =>
      kit.asyncCatch(async () => {
        const { chainId } = opts;
        this.logger.info('Handling sign payload request');
        return this._head().then((provider) =>
          methods.signTransaction({ request: payload, provider, chainId })
        );
      }),

    signTransactionFor: (
      payload: methods.signFor.TRequest,
      opts: Omit<common.IMethodConditional, 'sessionId'>
    ) =>
      kit.asyncCatch(async () => {
        const { chainId } = opts;
        this.logger.info('Handling signFor payload request');
        return this._head().then((provider) =>
          methods.signTransactionFor({ request: payload, provider, chainId })
        );
      }),

    signTransactionBatch: (
      payload: methods.signBatch.TRequest,
      opts: Omit<common.IMethodConditional, 'sessionId'>
    ) =>
      kit.asyncCatch(async () => {
        const { chainId } = opts;
        this.logger.info('Handling batch payload request');
        return this._head().then((provider) =>
          methods.signTransactionBatch({ request: payload, provider, chainId })
        );
      }),
  };
}
