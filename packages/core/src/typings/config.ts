import type * as chain from './chain';
import type * as other from './other';

export type ChainDetails = chain.Details;

export interface IConfig {
  /**
   * WalletConnect Project ID from Reown Cloud
   * @see https://cloud.reown.com
   */
  projectId: string;
  /**
   * Enhanced namespaces for the provider communication
   * Client needs a little more information for the chain information required by AppKit
   * Defaults to xrpl namespace
   */
  namespaces?: other.EnhancedNamespaceConfig;
  /**
   * Default chain for connection - set to active chain on initialization
   * If the network is changed, a new chain will need to be set (ie. setActive)
   * Defaults to first detected chain in namespaces
   */
  defaultChain?: string;
  /**
   * Wallet details for the preferred wallets for the modal and other interactions
   * Client reequired more information for deeplinking optimizations
   * Joey wallet will be included in this list if not provided
   */
  walletDetails?: other.WalletDetail[];
  /**
   * Enable logging for troubleshooting.
   * @default false
   */
  verbose?: boolean;
  /**
   * Configure session data persistence.
   * The client uses persists session data using IndexDB
   * @default undefined
   */
  storage?: other.Storage;
  /**
   * Project metadata for connection details - shown within the WalletKit
   * @see https://cloud.reown.com
   */
  metadata?: other.Metadata;
}
