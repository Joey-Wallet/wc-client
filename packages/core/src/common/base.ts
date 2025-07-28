import EventEmitter from 'eventemitter3';

import * as kit from '@joey-wallet/wc-utils';
import type * as common from '~/common';

export type TOpts = common.Opts;

export enum EBaseEvent {
  UPDATE = 'update',
  ERROR = 'error',
}

export interface IBaseEvents {
  [EBaseEvent.UPDATE]: () => void;
  [EBaseEvent.ERROR]: (error: Error) => void;
}

export class Base<TContext = 'Base'> extends EventEmitter<IBaseEvents, TContext> {
  opts: TOpts;
  logger: kit.Logger;

  eventCount = 0;

  constructor(opts: TOpts) {
    super();
    this.opts = opts;
    this.logger = new kit.Logger({ verbose: Boolean(this.opts.verbose) });
  }

  notify = () => {
    this.eventCount++;
    this.emit(EBaseEvent.UPDATE);
  };

  error = (e: Error) => {
    this.eventCount++;
    this.emit(EBaseEvent.ERROR, e);
  };

  tail = <T>(opts: T) => {
    this.notify();
    return opts;
  };
}
