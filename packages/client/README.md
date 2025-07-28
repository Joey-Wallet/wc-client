# WalletConnect Client for the XRP Ledger

[walletconnect](https://github.com/topics/walletconnect) | [joey-wallet](https://github.com/topics/joey-wallet) | [xrp](https://github.com/topics/xrp) | [xrpl](https://github.com/topics/xrpl)

![NPM](https://nodei.co/npm/@joey-wallet/wc-client.png)

---

### wc-client: Simplified XRP Ledger Integration with WalletConnect

`wc-client` is a developer-friendly client designed to streamline interaction with the XRP Ledger (XRPL) via WalletConnect. It abstracts away WalletConnect complexities—such as redirects, deep links, and modal handling—while leveraging the latest package dependencies to ensure a seamless experience with the XRP Ledger and Joey Wallet.

Tailored for developers building decentralized applications (DApps), wc-client accelerates integration, enabling you to focus on creating robust DApps.

> **Target Audience:** Developers seeking a fast, reliable way to integrate their DApps with the XRP Ledger and Joey Wallet.

## Features

`wc-client` offers two versions to provide flexibility based on your project's needs and desired feature set:

**Advanced** and **Standalone**.

### 1. Advanced (Recommended)

A feature-rich, multi-framework version optimized for complex DApps.

- Persisted Historical Data: Stores pending activities, previous requests, and wallet metadata for enhanced user experiences.
- Robust Session Management: Supports multiple, concurrent WalletConnect sessions, ideal for DApps requiring advanced connection handling.
- Framework-Agnostic: Compatible with various JavaScript frameworks, ensuring flexibility across different tech stacks.

### 2. Standalone

A lightweight, React-specific version delivered in a single file for minimal setup.

- Target Use Case: Perfect for developers who need a simple, React-only solution and don't require advanced features like multi-session support or historical data persistence.
- Minimal Footprint: Streamlined for quick integration with basic WalletConnect functionality.

## Getting Started

### Prerequisites

Before using `wc-client`, ensure you have the following:

- Node.js: Version 16 or higher (LTS recommended).
- A WalletConnect-compatible wallet (e.g., Joey Wallet) that supports XRPL interactions.
- A WalletConnect Project ID from [Reown Cloud](https://cloud.reown.com/) (formerly WalletConnect Cloud) for initializing the Universal Provider.
- Basic familiarity with the XRP Ledger and WalletConnect for seamless integration.

### Installation

To integrate `wc-client` into your decentralized application (DApp), install it using your preferred package manager: pnpm, npm, or yarn. Run one of the following commands in your project directory:

```bash
pnpm add @joey-wallet/wc-client
```

> Note: Ensure your project includes `@walletconnect/universal-provider` as a dependency, as `wc-client` builds on it for WalletConnect functionality. If not already included, you can install it alongside `wc-client`:

#### Next Steps:

After installation, you can initialize `wc-client` in your DApp to connect to the XRP Ledger via WalletConnect.

- Refer to the [Quick Start](#quick-start) section for a basic example of setting up the client, or explore the [Playground](./playground) directory for advanced use cases, including session management and transaction handling with Joey Wallet.
- For a more thorough explanation, [view here](./docs/installation.md).

## Quick Start

After installation, you can import and start using `wc-client`:

```jsx
// File located at ./src/context/advanced
'use client';

import { advance } from '@joey-wallet/wc-client/react';
import config from '~/common/wc-config'

export const Provider = (props: React.PropsWithChildren) => <wcc.Provider config={config}>{props.children}</wc.provider.Provider>;

export const useProvider = wcc.useProvider;
```

Usage Example:

```jsx
// File: ./src/app/page.jsx
import { Provider, useProvider } from '~/context/advanced';

export default function Home() {
  return (
    <Provider>
      <App />
    </Provider>
  );
}

function App() {
  const { provider, uri, activeSession, actions} = useProvider();

	const handleConnection = async () => {
		await actions.connect()
	}

  return (
    <div>
      {!uri && <button onClick={handleConnection}>Connect</button> }
      { uri && <div>{uri}</button> }
    </div>
  );
}
```

#### Next Steps:

- Configure the WalletConnect client by setting up the `wc-config` file (see Configuration Options (#configuration-options)).
- Explore some examples in the [Playground](./playground) directory for advanced use cases, such as transaction signing or multi-session management.
- For a more thorough explanation, [view here](./docs/getting-started.md).

### Configuration Options

The `wc-client` Provider requires a configuration object to initialize WalletConnect and connect to the XRP Ledger. Below is an example configuration file and a detailed explanation of available options, including the metadata field for WalletConnect project details.

```tsx
// File: ./src/common/wc-config.ts
import type { Config } from '@joey-wallet/wc-client';

export default {
  // Required
  projectId: process.env['NEXT_PUBLIC_PROJECT_ID'],
  // Optional - Add your projects details
  metadata: {
    name: 'Joey Example Project',
    description: 'A sample project using walletconnect and Joey Wallet.',
    url: 'http://localhost:3000',
    icons: ['/assets/favicon.ico'],
    redirect: {
      universal: 'http://localhost:3000',
    },
  },
} as Config;
```

- For a full configuration explanation, [view here](./docs/configuration.md).

## Examples

For more in-depth examples on how to use `wc-client`, check out our [Playground](./playground) directory. Here you'll find various scenarios from basic usage to complex usage:

- Basic Connection: Demonstrates how to connect to the XRP Ledger.
- Transaction Handling: Examples on how to manage transactions.
- Explore our live demo site here: [https://wc-toolkit.joeywallet.xyz](https://wc-toolkit.joeywallet.xyz)

# Contributors

The **wc-client** project is developed and maintained by the core development team at **Joey Wallet**, dedicated to building seamless tools for interacting with the **XRP Ledger (XRPL)**.

> **Note:** We welcome contributions from the community! Check out our [contribution guidelines](https://github.com/joeywallet/wc-client) for details on how to get involved.

## Contributing

We welcome contributions to `wc-client`! See our [CONTRIBUTING.md](http://contributing.md/) for guidelines on how to get started.

For bug reports, feature requests, or questions, please open an issue on the GitHub repository. We appreciate your feedback and collaboration in making `wc-client` better!

## Disclaimer

`wc-client` is provided as-is, with no warranties or guarantees of performance, reliability, or suitability for any particular purpose. While we strive to ensure it works seamlessly with the XRP Ledger, users should test and validate its functionality in their specific environments. The developers are not liable for any damages, losses, or issues arising from its use. Always ensure compliance with XRPL infrastructure providers' terms of service and rate limits when using this client.

## License

`wc-client` is licensed under the MIT License (LICENSE). You are free to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the software, provided that the copyright notice and permission notice are included in all copies or substantial portions of the software. See the LICENSE file in the repository for full details.
