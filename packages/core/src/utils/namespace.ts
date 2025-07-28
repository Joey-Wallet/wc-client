import * as networks from '@reown/appkit/networks';
import type * as typings from '~/typings';

import type { NamespaceConfig } from '@walletconnect/universal-provider';

export const generateNamespaceAccounts = (opts: { accounts: string[]; chains: string[] }) =>
  opts.accounts.map((a) => opts.chains.map((c) => `${c}:${a}`)).flat();

export const getNamespaceFromAccount = (account: string) => {
  try {
    const network = account.split(':')[0];
    const chain = account.split(':')[1];

    return `${network}:${chain}`;
  } catch (e) {
    return undefined;
  }
};

export const getNamespacesFromChains = (chains: string[]) => [
  ...new Set(chains.map((chain) => chain.split(':')[0])),
];

export const getChainsDetailFromNamspaces = (namespaces: typings.EnhancedNamespaceConfig) =>
  Object.entries(namespaces)
    .map(([_namespace, content]) => content.chains)
    .flat();

export const getMethodsByNamespace = (opts: {
  chain: string;
  namespaces: typings.EnhancedNamespaceConfig;
}) =>
  Object.entries(opts.namespaces).find(([_namespace]) => opts.chain.startsWith(_namespace))?.[1]
    .methods ?? [];

export const getEventsByNamespace = (opts: {
  chain: string;
  namespaces: typings.EnhancedNamespaceConfig;
}) =>
  Object.entries(opts.namespaces).find(([_namespace]) => opts.chain.startsWith(_namespace))?.[1]
    .events ?? [];

export const getChainDetails = (opts: {
  chain: string;
  namespaces: typings.EnhancedNamespaceConfig;
}) =>
  Object.entries(opts.namespaces)
    .find(([_namespace]) => opts.chain.startsWith(_namespace))?.[1]
    .chains.find((details) => details.id === opts.chain);

export const getNamespaces = (opts: {
  chain: string;
  namespaces: typings.EnhancedNamespaceConfig;
}): NamespaceConfig => {
  const { namespaces, chain } = opts;
  const [namespace] = chain.split(':');
  return Object.fromEntries(
    Object.entries(namespaces)
      .map(([_namespace, contents]) => {
        const chains = contents.chains.map((details) => details.id).filter((_id) => _id === chain);
        return [namespace, { ...contents, chains }] as const;
      })
      .filter(([_namespace]) => _namespace === namespace)
  );
};

export const mutateNamespaces = (namespaces: typings.EnhancedNamespaceConfig): NamespaceConfig =>
  Object.fromEntries(
    Object.entries(namespaces).map(([namespace, contents]) => {
      const chains = contents.chains.map((details) => details.id);
      return [namespace, { ...contents, chains }] as const;
    })
  );

export const getChainDetailsByChainsIds = (opts: {
  chains: string[];
  details: typings.ChainDetails[];
}) =>
  opts.chains
    .map((chain) => opts.details.find((dets) => dets.id === chain))
    .filter(Boolean) as typings.ChainDetails[];

export const getAppKitChain = (details: typings.ChainDetails) => {
  const { nativeCurrency, ...otherDetails } = details;
  const [name, id] = otherDetails.id.split(':');

  return networks.defineChain({
    id,
    name,
    nativeCurrency,
    rpcUrls: {
      default: { http: otherDetails.http[0], wss: otherDetails.ws[0] },
    },
    blockExplorers: {
      default: otherDetails.explorers[0],
    },
    chainNamespace: name,
    caipNetworkId: otherDetails.id,
  });
};
