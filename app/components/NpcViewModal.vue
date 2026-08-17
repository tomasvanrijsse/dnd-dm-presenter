<script setup lang="ts">
import type { Npc } from '~/types/cast'

defineProps<{ npc: Npc | null }>()

const emit = defineEmits<{
  close: []
  edit: [npc: Npc]
  delete: [npc: Npc]
}>()
</script>

<template>
  <UModal
    :open="npc !== null"
    :title="npc?.name"
    :ui="{ content: 'sm:max-w-2xl' }"
    @update:open="value => { if (!value) emit('close') }"
  >
    <template #body>
      <div
        v-if="npc"
        class="flex flex-col gap-4"
      >
        <div class="flex items-start gap-4">
          <UAvatar
            :src="npc.image"
            :alt="npc.name"
            size="3xl"
            class="shrink-0"
          />
          <div
            v-if="npc.description"
            class="rich-text-content text-sm text-muted"
            v-html="npc.description"
          />
          <p
            v-else
            class="text-sm text-muted"
          >
            No description yet.
          </p>
        </div>
      </div>
    </template>

    <template #footer>
      <div
        v-if="npc"
        class="flex w-full justify-between gap-2"
      >
        <UButton
          color="error"
          variant="ghost"
          icon="i-lucide-trash-2"
          @click="emit('delete', npc)"
        >
          Delete
        </UButton>
        <UButton
          color="neutral"
          variant="subtle"
          icon="i-lucide-pencil"
          @click="emit('edit', npc)"
        >
          Edit
        </UButton>
      </div>
    </template>
  </UModal>
</template>
