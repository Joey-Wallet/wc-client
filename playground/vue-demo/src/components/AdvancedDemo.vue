<template>
  <div class="w-full">
    <div class="bg-color1 rounded-lg p-6 border border-color6 mb-4 shadow-sm w-full max-w-md transition-all duration-300">
      <h2 class="text-xl font-semibold mb-4 text-color12">Advanced Provider Demo</h2>
      <p class="text-color11 mb-4">Using the advanced provider with full WalletConnect core integration.</p>
      
      <!-- Connection Status -->
      <div v-if="session" class="bg-color3 border border-color6 rounded-md p-4 mb-4 border-l-4 border-l-green9">
        <h3 class="text-lg font-semibold text-color12 mb-2">Connected!</h3>
        <div class="text-color11 mb-1"><strong class="text-color12">Chain:</strong> {{ chain }}</div>
        <div class="text-color11 mb-2"><strong class="text-color12">Accounts:</strong></div>
        <ul v-if="accounts && accounts.length" class="list-disc list-inside text-color11 ml-4 mb-2">
          <li v-for="account in accounts" :key="account" class="break-all overflow-hidden">{{ account }}</li>
        </ul>
        <div v-if="uri" class="text-color11 break-all overflow-hidden"><strong class="text-color12">URI:</strong> {{ uri.substring(0, 50) }}...</div>
      </div>

      <!-- Error Display -->
      <div v-if="error" class="bg-color3 border border-red9 rounded-md p-4 mb-4 border-l-4 border-l-red9 text-red9">
        <strong>Error:</strong> <span class="break-words">{{ error }}</span>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2 mb-4 flex-col sm:flex-row">
        <button 
          @click="handleConnect" 
          :disabled="loading || !!session"
          class="rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer bg-color1 text-color12 border-color6 hover:bg-color3 hover:border-color8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Connecting...' : 'Connect Wallet' }}
        </button>
        
        <button 
          @click="handleDisconnect" 
          :disabled="loading || !session"
          class="rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer bg-color1 text-color12 border-color6 hover:bg-color3 hover:border-color8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Disconnecting...' : 'Disconnect' }}
        </button>

        <button 
          @click="handleGenerate" 
          :disabled="loading"
          class="rounded-md border px-4 py-2 text-sm font-medium transition-all duration-200 inline-flex items-center justify-center cursor-pointer bg-color1 text-color12 border-color6 hover:bg-color3 hover:border-color8 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {{ loading ? 'Generating...' : 'Generate QR' }}
        </button>
      </div>

      <!-- Chain Selection -->
      <div v-if="chains && chains.length" class="mb-4">
        <label for="chain-select" class="text-color12 font-medium mb-2 block">Switch Chain:</label>
        <select 
          id="chain-select" 
          :value="chain" 
          @change="handleChainChange"
          class="ml-2 px-2 py-1 rounded-md border border-color6 bg-color1 text-color12 font-inherit"
        >
          <option v-for="chainId in chains" :key="chainId" :value="chainId">
            {{ chainId }}
          </option>
        </select>
      </div>

      <!-- QR Code Display -->
      <div v-if="qrUri" class="flex flex-col items-center justify-center p-6 bg-color1 rounded-md mb-4 border border-color6 text-center">
        <h3 class="mb-4 text-color12 text-lg font-semibold">Scan with Joey Wallet</h3>
        <div class="relative bg-white p-4 rounded-xl mb-4 flex justify-center items-center">
          <canvas ref="qrCanvas"></canvas>
          <!-- Joey Logo Overlay -->
          <div class="absolute flex justify-center items-center h-12 w-12 bg-white rounded p-1">
            <img src="/assets/joey-primary.png" alt="Joey Wallet" class="h-full w-full object-contain" />
          </div>
        </div>
        <div class="bg-color3 border border-color6 rounded p-3 text-xs text-color11 break-all max-w-full">
          {{ qrUri }}
        </div>
      </div>

      <!-- Session Details -->
      <div v-if="session" class="mt-4">
        <h3 class="text-lg font-semibold text-color12 mb-2">Session Details:</h3>
        <pre class="bg-color3 rounded-md p-4 overflow-x-auto overflow-y-auto max-h-96 whitespace-pre-wrap break-words border border-color6 text-sm text-color11">{{ JSON.stringify(session, null, 2) }}</pre>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { useWalletConnectProvider } from '@joey-wallet/wc-vue'
import QRCode from 'qrcode'

const loading = ref(false)
const error = ref<string | null>(null)
const qrUri = ref<string | null>(null)
const qrCanvas = ref<HTMLCanvasElement>()

// Use the WalletConnect provider context
const { 
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
  
  try {
    await QRCode.toCanvas(qrCanvas.value, uri, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })
  } catch (error) {
    console.error('Failed to generate QR code:', error)
  }
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

