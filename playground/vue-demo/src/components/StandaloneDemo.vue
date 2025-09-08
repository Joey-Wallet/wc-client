<template>
  <div class="demo-container">
    <div class="card">
      <h2>Standalone Provider Demo</h2>
      <p>Using the standalone provider with direct Universal Provider integration.</p>
      
      <!-- Connection Status -->
      <div v-if="session" class="wallet-info">
        <h3>Connected!</h3>
        <div><strong>Chain:</strong> {{ chain }}</div>
        <div><strong>Accounts:</strong></div>
        <ul v-if="accounts && accounts.length">
          <li v-for="account in accounts" :key="account">{{ account }}</li>
        </ul>
        <div v-if="uri"><strong>URI:</strong> {{ uri.substring(0, 50) }}...</div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="error">
        <strong>Error:</strong> {{ error }}
      </div>

      <!-- Action Buttons -->
      <div style="display: flex; gap: 1rem; margin: 1rem 0;">
        <button @click="handleConnect" :disabled="loading || !!session">
          {{ loading ? 'Connecting...' : 'Connect Wallet' }}
        </button>
        
        <button @click="handleDisconnect" :disabled="loading || !session">
          {{ loading ? 'Disconnecting...' : 'Disconnect' }}
        </button>

        <button @click="handleGenerate" :disabled="loading">
          {{ loading ? 'Generating...' : 'Generate QR' }}
        </button>
      </div>

      <!-- Chain Selection -->
      <div v-if="chains && chains.length" style="margin: 1rem 0;">
        <label for="chain-select-standalone"><strong>Switch Chain:</strong></label>
        <select id="chain-select-standalone" :value="chain" @change="handleChainChange">
          <option v-for="chainId in chains" :key="chainId" :value="chainId">
            {{ chainId }}
          </option>
        </select>
      </div>

      <!-- QR Code Display -->
      <div v-if="qrUri" class="qr-container">
        <div>
          <h3>Scan QR Code with your wallet:</h3>
          <div style="background: white; padding: 1rem; border-radius: 8px;">
            <canvas ref="qrCanvas"></canvas>
          </div>
          <p style="word-break: break-all; font-size: 0.8em;">{{ qrUri }}</p>
        </div>
      </div>

      <!-- Provider Details -->
      <div v-if="provider" style="margin-top: 2rem;">
        <h3>Provider Status:</h3>
        <div class="wallet-info">
          <div><strong>Connected:</strong> {{ !!session }}</div>
          <div><strong>Provider URI:</strong> {{ provider.uri || 'None' }}</div>
          <div><strong>Session Topic:</strong> {{ session?.topic || 'None' }}</div>
        </div>
      </div>

      <!-- Session Details -->
      <div v-if="session" style="margin-top: 1rem;">
        <h3>Session Details:</h3>
        <pre>{{ JSON.stringify(session, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useWalletConnectProvider } from '@joey-wallet/wc-vue'

const loading = ref(false)
const error = ref<string | null>(null)
const qrUri = ref<string | null>(null)
const qrCanvas = ref<HTMLCanvasElement>()

// Use the WalletConnect provider context (works for both advanced and standalone)
const { 
  provider,
  session, 
  accounts, 
  chains, 
  chain, 
  uri,
  actions,
  setChain 
} = useWalletConnectProvider()

const handleConnect = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await actions.value.connect()
    if (result.error) {
      error.value = result.error.message
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Connection failed'
  } finally {
    loading.value = false
  }
}

const handleDisconnect = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await actions.value.disconnect()
    if (result.error) {
      error.value = result.error.message
    } else {
      qrUri.value = null
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Disconnection failed'
  } finally {
    loading.value = false
  }
}

const handleGenerate = async () => {
  loading.value = true
  error.value = null
  
  try {
    const result = await actions.value.generate()
    if (result.error) {
      error.value = result.error.message
    } else if (result.data) {
      qrUri.value = result.data.uri
    }
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'QR generation failed'
  } finally {
    loading.value = false
  }
}

const handleChainChange = (event: Event) => {
  const target = event.target as HTMLSelectElement
  setChain(target.value)
}

// Generate QR code when URI changes
const generateQRCode = async (uri: string) => {
  if (!qrCanvas.value) return
  
  // Simple QR code placeholder - in a real app you'd use a QR library like 'qrcode'
  const canvas = qrCanvas.value
  const ctx = canvas.getContext('2d')
  if (!ctx) return
  
  canvas.width = 256
  canvas.height = 256
  
  // Fill with white background
  ctx.fillStyle = 'white'
  ctx.fillRect(0, 0, 256, 256)
  
  // Simple placeholder pattern (checkerboard)
  ctx.fillStyle = 'black'
  for (let i = 0; i < 16; i++) {
    for (let j = 0; j < 16; j++) {
      if ((i + j + uri.length) % 3 === 0) {
        ctx.fillRect(i * 16, j * 16, 16, 16)
      }
    }
  }
  
  // Add text
  ctx.fillStyle = 'red'
  ctx.font = '10px Arial'
  ctx.textAlign = 'center'
  ctx.fillText('Standalone QR', 128, 280)
}

watch(() => qrUri.value, (newUri) => {
  if (newUri && qrCanvas.value) {
    generateQRCode(newUri)
  }
})

watch(() => uri.value, (newUri) => {
  if (newUri) {
    qrUri.value = newUri
  }
})

onMounted(() => {
  // Auto-generate QR if URI exists on mount
  if (uri.value) {
    qrUri.value = uri.value
  }
})
</script>

<style scoped>
.demo-container {
  width: 100%;
}

select {
  margin-left: 0.5rem;
  padding: 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
  background: white;
  color: black;
}

.qr-container {
  text-align: center;
  color: black;
}

.qr-container h3 {
  color: white;
}
</style>