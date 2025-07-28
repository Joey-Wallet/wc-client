import type { SessionTypes } from '@walletconnect/types';
import type * as typings from '~/typings';

export const getAllAccounts = (session?: SessionTypes.Struct) =>
  session
    ? [
        ...new Set(
          Object.values(session.namespaces)
            .map((namespace) => namespace.accounts)
            .flat()
        ),
      ]
    : [];

export const getMethods = (session?: SessionTypes.Struct) =>
  session ? Object.keys(session.namespaces).flatMap((ns) => session.namespaces[ns].methods) : [];

export const getEvents = (session?: SessionTypes.Struct) =>
  session ? Object.keys(session.namespaces).flatMap((ns) => session.namespaces[ns].events) : [];

export const getAccountsByNamespace = (opts: {
  session?: SessionTypes.Struct;
  chain: typings.ChainDetails;
}) =>
  opts.session
    ? [
        ...new Set(
          Object.values(opts.session.namespaces)
            .map((namespace) => namespace.accounts)
            .flat()
        ),
      ].filter((account) => account.startsWith(`${opts.chain.id}:`))
    : [];

export const getChains = (session?: SessionTypes.Struct) =>
  session
    ? Object.keys(session.namespaces).flatMap((ns) => session.namespaces[ns].chains || [])
    : [];
