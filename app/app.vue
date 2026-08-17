<script setup>
const route = useRoute()

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

const title = 'DnD Wedding — Admiration Matrix'
const description = 'Track how many points each NPC holds for each player during the one shot.'

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
