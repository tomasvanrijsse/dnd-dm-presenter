<script setup lang="ts">
import type { Location } from '~/types/cast'
import type { Rect } from '~/types/fog'

const props = defineProps<{ location: Location | null }>()

const emit = defineEmits<{
  close: []
}>()

const locationDisplayStore = useLocationDisplayStore()
const { isActive, getFogState, showLocation, hideLocation, addFog, clearFog, revealRect } = locationDisplayStore

const cropMode = ref(false)

watch(() => props.location, () => {
  cropMode.value = false
})

const fogState = computed(() => props.location ? getFogState(props.location.id) : { fogEnabled: false, revealedRects: [] })

function toggleShow(): void {
  if (!props.location) {
    return
  }

  if (isActive(props.location.id)) {
    hideLocation()
  } else {
    showLocation(props.location.id)
  }
}

function onReveal(rect: Rect): void {
  if (props.location) {
    revealRect(props.location.id, rect)
  }
}
</script>

<template>
  <UModal
    :open="location !== null"
    title="Display location"
    :ui="{ content: 'sm:max-w-3xl' }"
    @update:open="value => { if (!value) emit('close') }"
  >
    <template #body>
      <div
        v-if="location"
        class="flex flex-col gap-4"
      >
        <div class="flex flex-wrap items-center gap-2">
          <UButton
            :color="isActive(location.id) ? 'error' : 'neutral'"
            :variant="isActive(location.id) ? 'solid' : 'subtle'"
            :icon="isActive(location.id) ? 'i-lucide-eye-off' : 'i-lucide-eye'"
            @click="toggleShow"
          >
            {{ isActive(location.id) ? 'Hide' : 'Show' }}
          </UButton>

          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-cloud-fog"
            @click="addFog(location.id)"
          >
            Add fog of war
          </UButton>

          <UButton
            color="neutral"
            variant="subtle"
            icon="i-lucide-cloud-sun"
            @click="clearFog(location.id)"
          >
            Clear fog of war
          </UButton>

          <UButton
            :color="cropMode ? 'error' : 'neutral'"
            :variant="cropMode ? 'solid' : 'subtle'"
            icon="i-lucide-crop"
            :disabled="!fogState.fogEnabled"
            @click="cropMode = !cropMode"
          >
            Crop
          </UButton>
        </div>

        <div class="flex max-h-[60vh] items-center justify-center overflow-hidden rounded-lg bg-black/80 p-2">
          <LocationFogCanvas
            :image="location.image"
            :revealed-rects="fogState.revealedRects"
            :fog-enabled="fogState.fogEnabled"
            mode="dm-preview"
            :interactive="cropMode"
            @reveal="onReveal"
          />
        </div>
      </div>
    </template>
  </UModal>
</template>
