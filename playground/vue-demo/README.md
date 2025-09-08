# WalletConnect Vue Demo

This demo showcases how to integrate WalletConnect with Vue 3 using the `@joey-wallet/wc-vue` package.

## Features

- **Two Provider Modes**: Compare Advanced vs Standalone providers
- **Vue 3 Composition API**: Modern reactive state management
- **TypeScript Support**: Full type safety
- **Real-time Updates**: Reactive connection status and session data
- **Chain Switching**: Dynamic chain selection
- **QR Code Generation**: Visual connection interface

## Getting Started

1. **Install dependencies**:
   ```bash
   pnpm install
   ```

2. **Update WalletConnect Project ID**:
   Edit `src/App.vue` and replace `'demo-project-id'` with your actual WalletConnect Project ID from [WalletConnect Cloud](https://cloud.walletconnect.com/).

3. **Start the development server**:
   ```bash
   pnpm dev
   ```

4. **Open your browser**:
   Navigate to `http://localhost:3001`

## Architecture

### Advanced Provider (`useWalletConnect`)
- Full WalletConnect core integration
- Advanced session management
- Event handling and state synchronization
- Recommended for production applications

### Standalone Provider (`useWalletConnectStandalone`)
- Direct Universal Provider integration
- Simpler setup for basic use cases
- Manual event subscription
- Good for prototyping and simple integrations

## Usage Examples

### Basic Setup

```vue
<template>
  <WalletConnectProvider :config="walletConfig">
    <YourApp />
  </WalletConnectProvider>
</template>

<script setup>
import { WalletConnectProvider } from '@joey-wallet/wc-vue'

const walletConfig = {
  projectId: 'your-project-id',
  metadata: {
    name: 'Your App Name',
    description: 'Your app description',
    url: 'https://your-app.com',
    icons: ['https://your-app.com/icon.png']
  },
  chains: ['eip155:1'], // Ethereum mainnet
}
</script>
```

### Using the Provider

```vue
<script setup>
import { useWalletConnectProvider } from '@joey-wallet/wc-vue'

const { connect, disconnect, session, accounts } = useWalletConnectProvider()

const handleConnect = async () => {
  const result = await connect()
  if (result.error) {
    console.error('Connection failed:', result.error)
  }
}
</script>
```

## Available Actions

- `connect()` - Connect to a wallet
- `disconnect()` - Disconnect current session  
- `generate()` - Generate QR code for connection
- `reconnect(session)` - Reconnect to existing session

## State Properties

- `session` - Current WalletConnect session
- `accounts` - Connected wallet accounts
- `chains` - Supported blockchain networks
- `chain` - Currently active chain
- `uri` - Connection URI for QR codes
- `provider` - Universal Provider instance

## Environment Variables

For production, consider setting:
- `VITE_WALLETCONNECT_PROJECT_ID` - Your WalletConnect project ID
- `VITE_APP_URL` - Your application URL

## Dependencies

- Vue 3.5+
- TypeScript 5.8+
- Vite 6.0+
- @joey-wallet/wc-vue (workspace package)

## Development

To modify this demo:

1. Edit components in `src/components/`
2. Update styling in `src/style.css`
3. Modify configuration in `src/App.vue`

## Troubleshooting

1. **"Provider not initialized" error**: Ensure you're using the composable within a provider component
2. **Connection fails**: Verify your project ID is correct and active
3. **TypeScript errors**: Ensure all dependencies are properly installed with `pnpm install`

## Learn More

- [Vue 3 Documentation](https://vuejs.org/)
- [WalletConnect Documentation](https://docs.walletconnect.com/)
- [Vite Documentation](https://vite.dev/)