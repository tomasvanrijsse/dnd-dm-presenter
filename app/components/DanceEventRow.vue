<script setup lang="ts">
defineProps<{
  events: string[]
  summary: string
  colspan: number
  bgClass: string
}>()

const collapsed = ref(true)
</script>

<template>
  <tr
    class="border-b border-default"
    :class="bgClass"
  >
    <td
      :colspan="colspan"
      class="relative px-4 py-3"
    >
      <UButton
        :icon="collapsed ? 'i-lucide-chevron-down' : 'i-lucide-chevron-up'"
        color="neutral"
        variant="ghost"
        size="xs"
        class="absolute right-2 top-1/2 -translate-y-1/2"
        :aria-label="collapsed ? 'Expand event' : 'Collapse event'"
        @click="collapsed = !collapsed"
      />

      <p
        v-if="collapsed"
        class="truncate px-8 text-center text-sm text-muted"
      >
        {{ summary }}
      </p>

      <template v-else>
        <p
          v-for="(eventText, index) in events"
          :key="index"
          class="px-8 text-center text-sm text-highlighted"
          :class="index > 0 ? 'mt-2' : ''"
        >
          {{ eventText }}
        </p>
      </template>
    </td>
  </tr>
</template>
