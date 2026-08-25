<script setup>
const route = useRoute()

const { markHydrated } = useHydrationStore()

onMounted(() => {
  markHydrated()
})

useHead({
  meta: [
    { name: 'viewport', content: 'width=device-width, initial-scale=1' }
  ],
  link: [
    { rel: 'icon', href: '/favicon.ico' }
  ],
  htmlAttrs: {
    lang: 'en'
  }
})

const title = 'DM NPC Presenter'
const description = 'Session tool for a DND game master, use a second screen like an iPad to display the NPCs to the players.\n'

useSeoMeta({
  title,
  description,
  ogTitle: title,
  ogDescription: description
})
</script>

<template>
  <UApp>
    <AppNav v-if="route.path !== '/present'" />

    <UMain>
      <NuxtPage />
    </UMain>
  </UApp>
</template>
