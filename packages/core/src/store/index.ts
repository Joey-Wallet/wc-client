import * as kit from '@joey-wallet/wc-utils';
import type { IKeyValueStorage } from '~/utils/storage';

import type { SignClientTypes } from '@walletconnect/types';
import type * as common from '~/common';

export type TRequest = common.TRequest;

export interface StoredRequest extends TRequest {
  timestamp: number;
}

export interface StoredMetadata extends Omit<SignClientTypes.Metadata, 'verifyUrl' | 'redirect'> {
  topics: string[];
}

const _get = async (store: IKeyValueStorage, key: string) => {
  const value = await store.getItem(key);
  if (!value) throw new Error('Value not set');
  return value as string;
};

export const requests = (store: IKeyValueStorage) => {
  const key = 'wcc:history:req';

  const _getAll = () =>
    kit.promiseCatch(
      _get(store, key).then(async (value) => (await JSON.parse(value)) as StoredRequest[])
    );

  const get = {
    all: _getAll,
    filter: (topic: string) =>
      _getAll().then((result) => result.data?.filter((r) => r.topic === topic)),
    exclude: (topic: string) =>
      _getAll().then((result) => result.data?.filter((r) => r.topic !== topic)),
  };

  const set = (_requests: StoredRequest[], topic: string) =>
    kit.asyncCatch(async () => {
      const excluding = await get.exclude(topic);
      const newStore = excluding ? [...excluding, ..._requests] : _requests;
      store.setItem(key, JSON.stringify(newStore));
    });

  return { get, set };
};

export const metadata = (store: IKeyValueStorage) => {
  const key = 'wcc:history:meta';

  const _getAll = () =>
    kit.promiseCatch(
      _get(store, key).then(async (value) => (await JSON.parse(value)) as StoredMetadata[])
    );

  const get = {
    all: _getAll,
    filter: (url: string) => _getAll().then((result) => result.data?.find((r) => r.url === url)),
    exclude: (url: string) => _getAll().then((result) => result.data?.filter((r) => r.url === url)),
  };

  const set = (_metadata: SignClientTypes.Metadata, topic: string) =>
    kit.asyncCatch(async () => {
      const { verifyUrl, redirect, ...rest } = _metadata;

      const excluding = await get.exclude(_metadata.url);
      const stored = await get.filter(_metadata.url);

      const topics = stored?.topics ? [...stored.topics, topic] : [topic];
      const newTopics = [...new Set(topics)];
      const self = { ...rest, topics: newTopics };

      const newStore = excluding ? [...excluding, self] : [self];
      store.setItem(key, JSON.stringify(newStore));
    });

  return { get, set };
};
