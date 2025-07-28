import * as kit from '@joey-wallet/wc-utils';

import { Index as Manager } from './manager';

import * as store from './store';

import { EBaseEvent } from './common/base';
import type { Index as Session } from './session';

import * as common from '~/common';

export type SessionsMap = Map<string, Session>;

export type TOpts = common.Opts;

type Name = 'Root';

export class Root<TContext = Name> extends common.base.Base<TContext> {
  opts: TOpts;
  logger: kit.Logger;

  manager: Manager;
  sessions: SessionsMap = new Map();

  constructor(opts: TOpts) {
    super(opts);
    this.opts = opts;
    this.logger = new kit.Logger({ verbose: Boolean(this.opts.verbose) });

    this.manager = new Manager({
      ...opts,
      root: this,
    });
    this.manager.on(EBaseEvent.UPDATE, this.notify);
  }

  head = async () => {
    const mount = await this.manager.mount();
    if (mount.error) throw mount.error;

    return mount.data;
  };

  getAllProjects = async () => {
    if (!this.opts.storage?.custom) return [];
    const result = await store.metadata(this.opts.storage.custom).get.all();

    if (result.error) {
      this.logger.warn(result.error);
      return [];
    }

    return result.data;
  };

  getAllRequests = async () => {
    if (!this.opts.storage?.custom) return [];
    const result = await store.requests(this.opts.storage.custom).get.all();

    if (result.error) {
      this.logger.warn(result.error);
      return [];
    }

    return result.data.sort((a, b) => b.timestamp - a.timestamp);
  };
}
