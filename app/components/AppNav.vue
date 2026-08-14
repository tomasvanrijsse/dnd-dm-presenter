<script setup lang="ts">
const items = [
  { label: 'Admiration Matrix', icon: 'i-lucide-users', to: '/' },
  { label: 'The Dancing', icon: 'i-lucide-music', to: '/dancing' },
  { label: 'NPC Display', icon: 'i-lucide-monitor', to: '/present', target: '_blank' }
]
</script>

<template>
  <div class="border-b border-default bg-default">
    <UContainer>
      <UNavigationMenu :items="items" />
    </UContainer>
  </div>
</template>
