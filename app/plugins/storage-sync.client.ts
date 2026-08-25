export default defineNuxtPlugin((nuxtApp) => {
  window.addEventListener('storage', () => {
    nuxtApp.$pinia._s.forEach(store => store.$hydrate?.())
  })
})
