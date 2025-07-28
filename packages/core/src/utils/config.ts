import { namespace } from '.';
import type { ProviderConfig, other } from '~/typings';
import * as chains from '~/common/constants/chains';

export interface IStrictConfig extends ProviderConfig {
  namespaces: other.EnhancedNamespaceConfig;
  defaultChain: string;
}

export const configBuilder = (config: ProviderConfig): IStrictConfig => {
  const namespaces = config.namespaces ?? chains.xrplNamespace;
  const defaultChain =
    config.defaultChain ?? namespace.getChainsDetailFromNamspaces(namespaces)[0].id;

  return {
    projectId: config.projectId,
    namespaces,
    defaultChain,
    walletDetails: config.walletDetails,
    verbose: config.verbose,
    storage: config.storage,
    metadata: config.metadata,
  };
};
