<script setup lang="ts">
import type { Npc } from '~/types/cast'

const props = defineProps<{ npc?: Npc | null }>()
const open = defineModel<boolean>('open', { default: false })

const { addNpc, updateNpc } = useNpcsStore()

const form = reactive({ name: '', image: '', description: '' })

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  form.name = props.npc?.name ?? ''
  form.image = props.npc?.image ?? ''
  form.description = props.npc?.description ?? ''
})

async function onImageFileChange(file: File | null | undefined): Promise<void> {
  if (!file) {
    return
  }

  form.image = await convertImageFileToWebp(file)
}

function save(): void {
  const input = { name: form.name.trim(), image: form.image.trim(), description: form.description.trim() }

  if (!input.name) {
    return
  }

  if (props.npc) {
    updateNpc(props.npc.id, input)
  } else {
    addNpc(input)
  }

  open.value = false
}

const aiGeneratorOpen = ref(false)

function onAiImageAccepted(image: string): void {
  form.image = image
  save()
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="npc ? 'Edit NPC' : 'Add NPC'"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Name">
          <UInput
            v-model="form.name"
            class="w-full"
            placeholder="NPC name"
          />
        </UFormField>

        <UFormField
          label="Image"
        >
          <div class="flex items-center gap-3">
            <img
              v-if="form.image"
              :src="form.image"
              class="size-12 rounded object-cover"
              alt=""
            >
            <UFileUpload
              accept="image/*"
              label="Choose image"
              class="flex-1"
              @update:model-value="onImageFileChange"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-sparkles"
              @click="aiGeneratorOpen = true"
            >
              Generate with AI
            </UButton>
          </div>
        </UFormField>

        <UFormField label="Description">
          <RichTextEditor v-model="form.description" />
        </UFormField>
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
          :disabled="!form.name.trim()"
          @click="save"
        >
          Save
        </UButton>
      </div>
    </template>
  </UModal>

  <AiImageGeneratorModal
    v-model:open="aiGeneratorOpen"
    @accept="onAiImageAccepted"
  />
</template>
