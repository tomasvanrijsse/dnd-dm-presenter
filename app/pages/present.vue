<script setup lang="ts">
useHead({
  title: 'NPC Display',
  htmlAttrs: { style: 'overflow: hidden' },
  bodyAttrs: { style: 'overflow: hidden; margin: 0' }
})
</script>

<template>
  <div class="fixed inset-0 overflow-hidden mb-8">
    <PresentView />
  </div>
</template>
