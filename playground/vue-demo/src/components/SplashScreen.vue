<template>
  <div
    v-if="isVisible"
    data-variant="Accent"
    :class="`absolute z-[1000] h-full w-full flex flex-col justify-center items-center bg-color8 text-color12 transition-opacity ease-out duration-700 ${isExiting ? 'opacity-0' : 'opacity-100'}`"
    @transitionend="handleTransitionEnd"
  >
    <div class="flex grow h-full w-full items-center justify-center shrink-0">
      <div class="h-1/2 w-1/2 max-w-[72px] max-h-[72px] justify-center">
        <div class="flex items-center justify-center">
          <!-- Joey Logo with spin animation -->
          <div class="h-16 w-16 animate-spin">
            <img src="/assets/joey-primary.png" alt="Joey Wallet" class="h-full w-full object-contain" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'

const isVisible = ref(true)
const loadingState = ref('loading')
const isExiting = computed(() => loadingState.value === 'exiting')
let timeout: NodeJS.Timeout | null = null

onMounted(async () => {
  // Initialize the splash screen
  try {
    console.log('Starting initialization')
    await new Promise((resolve) => setTimeout(resolve, 1000))
    console.log('Initialization complete, setting exiting state')
    loadingState.value = 'exiting'
    
    // Fallback timeout for when transitionend doesn't fire
    timeout = setTimeout(() => {
      console.log('Fallback timeout triggered, setting done state')
      loadingState.value = 'done'
      isVisible.value = false
    }, 800) // Slightly longer than the 700ms transition duration
  } catch (error) {
    console.error('Initialization failed:', error)
    loadingState.value = 'exiting'
  }
})

onUnmounted(() => {
  if (timeout) {
    clearTimeout(timeout)
  }
})

const handleTransitionEnd = (event: TransitionEvent) => {
  if (event.propertyName === 'opacity' && isExiting.value) {
    console.log('Transition ended, hiding splash')
    isVisible.value = false
  }
}
</script>