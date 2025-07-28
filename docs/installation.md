## Installation

To integrate `wc-client` into your decentralized application (DApp), install it using your preferred package manager: pnpm, npm, or yarn. Run one of the following commands in your project directory:

```bash
# Using pnpm (recommended for faster installs)
pnpm add @joey-wallet/wc-client
```

```bash
# Using npm
npm install @joey-wallet/wc-client
```

```bash
# Using yarn
yarn add @joey-wallet/wc-client
```

```bash
pnpm add @walletconnect/universal-provider
```

> Note: Ensure your project includes `@walletconnect/universal-provider` as a dependency, as `wc-client` builds on it for WalletConnect functionality. If not already included, you can install it alongside `wc-client`:

#### Next Steps:

After installation, you can initialize `wc-client` in your DApp to connect to the XRP Ledger via WalletConnect. Refer to the [Quick Start](#quick-start) section for a basic example of setting up the client, or explore the [Playground](./playground) directory for advanced use cases, including session management and transaction handling with Joey Wallet.
