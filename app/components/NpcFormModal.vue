<script setup lang="ts">
import type { Npc } from '~/types/cast'

const props = defineProps<{ npc?: Npc | null }>()
const open = defineModel<boolean>('open', { default: false })

const { addNpc, updateNpc } = useNpcs()

const form = reactive({ name: '', image: '', description: '' })

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  form.name = props.npc?.name ?? ''
  form.image = props.npc?.image ?? ''
  form.description = props.npc?.description ?? ''
})

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
          hint="Path or URL"
        >
          <UInput
            v-model="form.image"
            class="w-full"
            placeholder="/NPCs/example.jpg"
          />
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
</template>
