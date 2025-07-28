export interface Currency {
  name: string; // Name of the native currency
  symbol: string; // Currency symbol
  decimals: number; // Number of decimal places for XRP
}

export interface Explorer {
  name: string; // Name of the explorer
  url: string; //  URL for the  explorer
}

export interface Details {
  id: string; // Unique chain identifier (xrpl:0)
  name: string; // Human-readable name of the devnet
  http: string[]; // HTTP RPC endpoint for devnet
  ws: string[]; // WebSocket endpoint for devnet
  nativeCurrency: Currency; // Information about native currency
  explorers: Explorer[]; // Grouping of available explorers
  isDev: boolean; // Indicates this is a development network
}
