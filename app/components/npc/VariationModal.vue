<script setup lang="ts">
import type { NpcImage } from '~/types/npc'
import type { GeneratedNpcImage } from '~/utils/leonardoImageGenerator'

const props = defineProps<{ source: NpcImage | null }>()
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ accept: [image: NpcImage] }>()

const { apiKey } = useLeonardoApiKey()

const label = ref('')
const variation = ref('')
const isGenerating = ref(false)
const error = ref('')
const generatedImage = ref<GeneratedNpcImage | null>(null)

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  label.value = ''
  variation.value = ''
  error.value = ''
  generatedImage.value = null
})

async function generate(): Promise<void> {
  if (!apiKey.value || !props.source) {
    return
  }

  isGenerating.value = true
  error.value = ''
  generatedImage.value = null

  try {
    const reference = await leonardoReferenceFor(props.source)

    if (!reference) {
      throw new Error('The source image could not be loaded')
    }

    generatedImage.value = await generateLeonardoNpcImageVariation(apiKey.value, reference, variation.value)
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to generate image'
  } finally {
    isGenerating.value = false
  }
}

function accept(): void {
  if (!generatedImage.value) {
    return
  }

  emit('accept', { ...generatedImage.value, label: label.value.trim() })
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Generate image variation with AI"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UAlert
          v-if="!apiKey"
          color="warning"
          variant="subtle"
          icon="i-lucide-triangle-alert"
          title="No Leonardo.ai API key set"
        >
          <template #description>
            Add one on the
            <NuxtLink
              to="/admin"
              class="text-primary hover:underline"
            >
              Admin page
            </NuxtLink>
            before generating images.
          </template>
        </UAlert>

        <div
          v-if="source"
          class="flex items-center gap-3"
        >
          <StoredAvatar
            :image="source.image"
            :alt="source.label"
            size="3xl"
          />
          <p class="text-sm text-muted">
            The new image is based on {{ source.label || 'this image' }}.
          </p>
        </div>

        <UFormField label="Label">
          <UInput
            v-model="label"
            class="w-full"
            placeholder="e.g. Angry"
          />
        </UFormField>

        <UFormField label="What should change">
          <UTextarea
            v-model="variation"
            class="w-full"
            placeholder="e.g. furious expression, red face, clenched teeth"
          />
        </UFormField>

        <UButton
          color="primary"
          variant="subtle"
          icon="i-lucide-sparkles"
          :loading="isGenerating"
          :disabled="!apiKey || !variation.trim()"
          class="self-start"
          @click="generate"
        >
          Generate
        </UButton>

        <p
          v-if="error"
          class="text-sm text-error"
        >
          {{ error }}
        </p>

        <div
          v-if="generatedImage"
          class="flex flex-col items-center gap-3"
        >
          <StoredImage
            :image="generatedImage.image"
            class="max-h-64 rounded object-cover"
            alt="Generated NPC portrait variation"
          />
        </div>
      </div>
    </template>

    <template #footer>
      <div class="flex justify-end gap-2 w-full">
        <UButton
          color="neutral"
          variant="ghost"
          @click="open = false"
        >
          Cancel
        </UButton>
        <UButton
          color="primary"
          :disabled="!generatedImage || !label.trim()"
          @click="accept"
        >
          Accept
        </UButton>
      </div>
    </template>
  </UModal>
</template>
