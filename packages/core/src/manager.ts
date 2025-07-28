import Provider from '@walletconnect/universal-provider';

import { getAppMetadata } from '@walletconnect/utils';
import * as kit from '@joey-wallet/wc-utils';

import type { PairingTypes, SessionTypes } from '@walletconnect/types';
import type { Root, SessionsMap } from './root';
import * as utils from '~/utils';

import { Index as Session } from '~/session';

import * as common from '~/common';
import { EProviderEvents } from '~/typings';

export const EventsArray = Object.values(EProviderEvents);

export { Provider };

export type TOpts = Omit<common.Opts, 'chainId'> & {
  root: Root<any>;
  handlers?: common.TUserDefinedHandlers<unknown>;
};

export class Index extends common.base.Base<'Manager'> {
  opts: TOpts;

  provider?: Provider;
  logger: kit.Logger;

  constructor(opts: TOpts) {
    super(opts);

    this.opts = opts;
    this.logger = new kit.Logger({ verbose: Boolean(this.opts.verbose) });

    this.init();
  }

  init = async () =>
    kit
      .asyncCatch(async () => {
        const mount = await this.mount();

        if (mount.error) {
          this.logger.error(mount.error);
          throw mount.error;
        }
        return mount.data;
      })
      .then(this.tail);

  getAllSessions = (provider: Provider) =>
    [provider.session].filter(Boolean) as SessionTypes.Struct[];

  setProvider = async () =>
    kit
      .asyncCatch(async () => {
        if (this.provider) return this.provider;

        // Defaults to using IndexDB for presistent storage
        const { enabled = true, custom = undefined } = this.opts.storage ?? {};

        let customStorage: utils.storage.IKeyValueStorage | null = enabled
          ? null
          : new utils.storage.NoStorage();
        if (custom) customStorage = custom;

        const provider = await Provider.init({
          projectId: this.opts.projectId,
          metadata: getAppMetadata(),
          logger: this.opts.verbose ? 'info' : 'silent',
          storage: customStorage,
        });

        // Since we have mounted a new provider, reset stored data
        this.setData(provider);
        this.subscribe(provider);

        this.provider = provider;

        return provider;
      })
      .then(this.tail);

  setData = (provider: Provider) => {
    this.opts.root.sessions.clear();
    const storedSessions = this.getAllSessions(provider);
    this.logger.obj.info({ msg: 'Setting stored sessions', sessions: storedSessions });

    storedSessions.map((session) =>
      this.opts.root.sessions.set(
        session.topic,
        new Session({
          ...this.opts,
          manager: this,
          session,
        })
      )
    );

    this.notify();
  };

  mount = async () => await this.setProvider();

  record = (event: string) => this.logger.info(event);

  unsubscribe = (provider: Provider) =>
    EventsArray.map((event) => {
      provider.off(event, () => this.record(event));
    });

  subscribe = (provider: Provider) => {
    this.unsubscribe(provider);

    const custom = [EProviderEvents.UPDATE, EProviderEvents.DELETE];

    provider.on(EProviderEvents.URI, (display_uri: string) => {
      this.record(EProviderEvents.URI);
      this.notify();
    });

    provider.on(EProviderEvents.CONNECT, () => {
      this.record(EProviderEvents.CONNECT);
      this.notify();
    });

    provider.on(EProviderEvents.UPDATE, () => {
      this.record(EProviderEvents.UPDATE);
      if (provider.session?.topic) {
        const session = this.opts.root.sessions.get(provider.session.topic);
        if (session) session.update();
      }
    });

    provider.on(EProviderEvents.DELETE, () => {
      this.record(EProviderEvents.DELETE);
      this.opts.root.sessions.clear();
      this.notify();
    });

    provider.on(EProviderEvents.PROVIDER_CONNECT, () => {
      this.record(EProviderEvents.PROVIDER_CONNECT);
      this.notify();
    });

    provider.on(EProviderEvents.PROVIDER_DISCONNECT, () => {
      this.record(EProviderEvents.PROVIDER_DISCONNECT);
      this.notify();
    });

    provider.on(EProviderEvents.PROVIDER_ERROR, () => {
      this.record(EProviderEvents.PROVIDER_ERROR);
      this.notify();
    });

    EventsArray.filter((e) => !custom.includes(e)).map((event) => {
      provider.on(event, () => this.record(event));
    });
  };
}
