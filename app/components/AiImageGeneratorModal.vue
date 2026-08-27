<script setup lang="ts">
const open = defineModel<boolean>('open', { default: false })
const emit = defineEmits<{ accept: [image: string] }>()

const { apiKey } = useLeonardoApiKey()

const RACE_OPTIONS = ['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goblin', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Orc', 'Tiefling']
const GENDER_OPTIONS = ['Male', 'Female']
const AGE_OPTIONS = ['Child', 'Teenager', 'Young adult', 'Adult', 'Middle-aged', 'Elderly']

const race = ref('')
const gender = ref('')
const age = ref('')
const role = ref('')
const description = ref('')

const isGenerating = ref(false)
const error = ref('')
const generatedImage = ref('')

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  error.value = ''
  generatedImage.value = ''
})

async function generate(): Promise<void> {
  if (!apiKey.value) {
    return
  }

  isGenerating.value = true
  error.value = ''
  generatedImage.value = ''

  try {
    generatedImage.value = await generateLeonardoNpcImage(apiKey.value, {
      race: race.value,
      gender: gender.value,
      age: age.value,
      role: role.value,
      description: description.value
    })
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'Failed to generate image'
  } finally {
    isGenerating.value = false
  }
}

function accept(): void {
  emit('accept', generatedImage.value)
  open.value = false
}
</script>

<template>
  <UModal
    v-model:open="open"
    title="Generate NPC image with AI"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Leonardo.ai API key">
          <template #hint>
            <a
              href="https://app.leonardo.ai/api-access/api-keys"
              target="_blank"
              rel="noopener noreferrer"
              class="text-primary hover:underline"
            >
              Create API token
            </a>
          </template>

          <UInput
            v-model="apiKey"
            type="password"
            class="w-full"
            placeholder="API key"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField label="Race">
            <USelect
              v-model="race"
              :items="RACE_OPTIONS"
              class="w-full"
              placeholder="Select race"
            />
          </UFormField>

          <UFormField label="Gender">
            <USelect
              v-model="gender"
              :items="GENDER_OPTIONS"
              class="w-full"
              placeholder="Select gender"
            />
          </UFormField>

          <UFormField label="Age">
            <USelect
              v-model="age"
              :items="AGE_OPTIONS"
              class="w-full"
              placeholder="Select age"
            />
          </UFormField>

          <UFormField label="Occupation / role">
            <UInput
              v-model="role"
              class="w-full"
              placeholder="e.g. blacksmith"
            />
          </UFormField>
        </div>

        <UFormField label="Description">
          <UTextarea
            v-model="description"
            class="w-full"
            placeholder="Extra details for the portrait"
          />
        </UFormField>

        <UButton
          color="primary"
          variant="subtle"
          icon="i-lucide-sparkles"
          :loading="isGenerating"
          :disabled="!apiKey"
          class="self-start"
          @click="generate"
        >
          Generate
        </UButton>

        <p
          v-if="error"
          class="text-sm text-error"
        >
          {{ error }}
        </p>

        <div
          v-if="generatedImage"
          class="flex flex-col items-center gap-3"
        >
          <img
            :src="generatedImage"
            class="max-h-64 rounded object-cover"
            alt="Generated NPC portrait"
          >
        </div>
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
          :disabled="!generatedImage"
          @click="accept"
        >
          Accept
        </UButton>
      </div>
    </template>
  </UModal>
</template>
