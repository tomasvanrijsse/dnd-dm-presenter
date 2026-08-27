export const LEONARDO_API_KEY_STORAGE_KEY = 'dm-presenter:leonardo-api-key'

const STORAGE_KEY = LEONARDO_API_KEY_STORAGE_KEY

export function useLeonardoApiKey() {
  const apiKey = ref(import.meta.client ? window.localStorage.getItem(STORAGE_KEY) ?? '' : '')

  watch(apiKey, (value) => {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  })

  return { apiKey }
}
