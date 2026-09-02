import { DEFAULT_IMAGE_STYLE_PROMPT } from '~/utils/leonardoImageGenerator'

export const LEONARDO_IMAGE_STYLE_STORAGE_KEY = 'dm-presenter:leonardo-image-style'

const STORAGE_KEY = LEONARDO_IMAGE_STYLE_STORAGE_KEY

export function useLeonardoImageStyle() {
  const style = ref(import.meta.client ? window.localStorage.getItem(STORAGE_KEY) ?? DEFAULT_IMAGE_STYLE_PROMPT : DEFAULT_IMAGE_STYLE_PROMPT)

  watch(style, (value) => {
    if (value) {
      window.localStorage.setItem(STORAGE_KEY, value)
    } else {
      window.localStorage.removeItem(STORAGE_KEY)
    }
  })

  return { style }
}
