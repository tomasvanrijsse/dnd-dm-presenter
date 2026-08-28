<script setup lang="ts">
const baseURL = useRuntimeConfig().app.baseURL.replace(/\/$/, '')

const items = [
  { label: 'NPCs', icon: 'i-lucide-users', to: '/' },
  { label: 'Session Events', icon: 'i-lucide-calendar-days', to: '/session-events' },
  { label: 'NPC Display', icon: 'i-lucide-monitor', to: `${baseURL}/present`, target: '_blank' },
  { label: 'Players', icon: 'i-lucide-settings', to: '/admin' }
]

const { exportState, importState } = useStateBackup()

const fileInput = ref<HTMLInputElement>()

function triggerLoad(): void {
  fileInput.value?.click()
}

async function onFileSelected(event: Event): Promise<void> {
  const file = (event.target as HTMLInputElement).files?.[0]

  if (file) {
    await importState(file)
  }
}

const storageUsageStore = useStorageUsageStore()
const { usedBytes } = storeToRefs(storageUsageStore)
const { limitBytes, refresh: refreshStorageUsage } = storageUsageStore
const usagePercent = computed(() => Math.min(100, (usedBytes.value / limitBytes) * 100))
const usageColor = computed(() => usagePercent.value >= 90 ? 'text-error' : 'text-muted')

let storageUsagePoll: ReturnType<typeof setInterval>

onMounted(() => {
  refreshStorageUsage()
  storageUsagePoll = setInterval(refreshStorageUsage, 3000)
})

onBeforeUnmount(() => {
  clearInterval(storageUsagePoll)
})
</script>

<template>
  <div class="border-b border-default bg-default">
    <UContainer class="flex items-center justify-between">
      <UNavigationMenu
        :items="items"
        class="flex-1"
      />

      <div class="flex items-center gap-3">
        <span
          class="text-xs whitespace-nowrap"
          :class="usageColor"
          :title="`${formatBytes(usedBytes)} of ~${formatBytes(limitBytes)} browser storage used`"
        >
          {{ formatBytes(usedBytes) }} / {{ formatBytes(limitBytes) }}
        </span>
        <UColorModeButton />
        <UButton
          icon="i-lucide-save"
          color="neutral"
          variant="ghost"
          title="Save state to zip"
          @click="exportState"
        />
        <UButton
          icon="i-lucide-download"
          color="neutral"
          variant="ghost"
          title="Load state from zip"
          @click="triggerLoad"
        />
        <input
          ref="fileInput"
          type="file"
          accept="application/zip,.zip"
          class="hidden"
          @change="onFileSelected"
        >
      </div>
    </UContainer>
  </div>
</template>
