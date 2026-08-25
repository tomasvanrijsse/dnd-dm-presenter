<script setup lang="ts">
const items = [
  { label: 'NPCs', icon: 'i-lucide-users', to: '/' },
  { label: 'Session Events', icon: 'i-lucide-calendar-days', to: '/session-events' },
  { label: 'NPC Display', icon: 'i-lucide-monitor', to: '/present', target: '_blank' },
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
</script>

<template>
  <div class="border-b border-default bg-default">
    <UContainer class="flex items-center justify-between">
      <UNavigationMenu
        :items="items"
        class="flex-1"
      />

      <div class="flex items-center gap-1">
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
