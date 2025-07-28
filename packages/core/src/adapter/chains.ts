enum XrplChainId {
  mainnet = 'xrpl:0',
  testnet = 'xrpl:1',
  devnet = 'xrpl:2',
}

export interface ChainData {
  name: string;
  id: XrplChainId;
  rpc: string[];
  slip44: number;
}

export const mainnet: ChainData = {
  name: 'XRPL',
  id: XrplChainId['mainnet'],
  rpc: ['https://s2.ripple.com:51234/'],
  slip44: 144,
};

export const testnet: ChainData = {
  name: 'XRPL Testnet',
  id: XrplChainId['testnet'],
  rpc: ['https://s.altnet.rippletest.net:51234/'],
  slip44: 144,
};

export const devnet: ChainData = {
  name: 'XRPL Devnet',
  id: XrplChainId['devnet'],
  rpc: ['https://s.devnet.rippletest.net:51234/'],
  slip44: 144,
};
