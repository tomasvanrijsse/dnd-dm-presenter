<script setup lang="ts">
import type { Npc, NpcImage } from '~/types/npc'
import type { GeneratedNpcImage } from '~/utils/leonardoImageGenerator'

const props = defineProps<{ npc?: Npc | null }>()
const open = defineModel<boolean>('open', { default: false })

const npcsStore = useNpcsStore()
const { addNpc, updateNpc } = npcsStore

const { groups } = storeToRefs(useNpcGroupsStore())
const NO_GROUP = '__none__'
const groupOptions = computed(() => [
  { label: 'No group', value: NO_GROUP },
  ...groups.value.map(group => ({ label: group.name, value: group.id }))
])

const SPECIES_OPTIONS = ref(['Dragonborn', 'Dwarf', 'Elf', 'Gnome', 'Goblin', 'Half-Elf', 'Half-Orc', 'Halfling', 'Human', 'Orc', 'Tiefling'])
const AGE_OPTIONS = ['Child', 'Teenager', 'Young adult', 'Adult', 'Middle-aged', 'Elderly']

const form = reactive({
  name: '',
  displayName: '',
  images: [] as NpcImage[],
  activeImage: '',
  species: '',
  gender: '',
  age: '',
  role: '',
  description: '',
  appearanceDescription: '',
  groupId: undefined as string | undefined
})

watch(open, (isOpen) => {
  if (!isOpen) {
    return
  }

  form.name = props.npc?.name ?? ''
  form.displayName = props.npc?.displayName ?? ''
  form.images = props.npc?.images.map(entry => ({ ...entry })) ?? []
  form.activeImage = props.npc?.image ?? ''
  form.species = props.npc?.species ?? ''
  form.gender = props.npc?.gender ?? ''
  form.age = props.npc?.age ?? ''
  form.role = props.npc?.role ?? ''
  form.description = props.npc?.description ?? ''
  form.appearanceDescription = props.npc?.appearanceDescription ?? ''
  form.groupId = props.npc?.groupId ?? NO_GROUP
  aiValidationAttempted.value = false
})

function onSpeciesCreate(species: string): void {
  SPECIES_OPTIONS.value.push(species)
  SPECIES_OPTIONS.value.sort()
  form.species = species
}

async function onImageFileChange(file: File | null | undefined): Promise<void> {
  if (!file) {
    return
  }

  replaceActiveImage({ image: await putImageBlob(await convertImageFileToWebpBlob(file, PORTRAIT_IMAGE_ENCODING)) })
}

const activeImage = computed(() => form.images.find(entry => entry.image === form.activeImage) ?? null)

function replaceActiveImage(next: Omit<NpcImage, 'label'>): void {
  if (activeImage.value) {
    Object.assign(activeImage.value, { leonardoImageId: undefined, ...next })
  } else {
    form.images.push({ label: 'Default', ...next })
  }

  form.activeImage = next.image
}

function removeImage(image: string): void {
  form.images = form.images.filter(entry => entry.image !== image)

  if (form.activeImage === image) {
    form.activeImage = form.images[0]?.image ?? ''
  }
}

function save(): void {
  const input = {
    name: form.name.trim(),
    displayName: form.displayName.trim() || undefined,
    image: activeImage.value?.image ?? '',
    leonardoImageId: activeImage.value?.leonardoImageId,
    images: form.images.map(entry => ({ ...entry, label: entry.label.trim() })),
    species: form.species,
    gender: form.gender.trim(),
    age: form.age,
    role: form.role.trim(),
    description: form.description.trim(),
    appearanceDescription: form.appearanceDescription.trim(),
    groupId: form.groupId === NO_GROUP ? undefined : form.groupId
  }

  if (!input.name) {
    return
  }

  if (props.npc) {
    updateNpc(props.npc.id, input)
  } else {
    addNpc(input)
  }

  open.value = false
}

const aiGeneratorOpen = ref(false)
const aiFieldsComplete = computed(() => Boolean(form.species && form.gender.trim() && form.age && form.role.trim()))
const aiValidationAttempted = ref(false)

function openAiGenerator(): void {
  if (!aiFieldsComplete.value) {
    aiValidationAttempted.value = true
    return
  }

  aiGeneratorOpen.value = true
}

function onAiImageAccepted(generated: GeneratedNpcImage): void {
  replaceActiveImage(generated)
  save()
}

const variationGeneratorOpen = ref(false)

function onVariationAccepted(variation: NpcImage): void {
  form.images.push(variation)
  form.activeImage = variation.image

  // Generated images cost credits, so keep them even when the form is cancelled.
  const stored = npcsStore.npcs.find(npc => npc.id === props.npc?.id)

  if (stored) {
    updateNpc(stored.id, { images: [...stored.images, variation] })
  }
}
</script>

<template>
  <UModal
    v-model:open="open"
    :title="npc ? 'Edit NPC' : 'Add NPC'"
  >
    <template #body>
      <div class="flex flex-col gap-4">
        <UFormField label="Name">
          <UInput
            v-model="form.name"
            class="w-full"
            placeholder="NPC name"
          />
        </UFormField>

        <UFormField
          label="Display name"
          help="Shown to the players instead of the name. Leave empty to show the name."
        >
          <UInput
            v-model="form.displayName"
            class="w-full"
            placeholder="e.g. The hooded stranger"
          />
        </UFormField>

        <UFormField
          v-if="groupOptions.length > 0"
          label="Group"
        >
          <USelect
            v-model="form.groupId"
            :items="groupOptions"
            value-key="value"
            placeholder="No group"
            class="w-full"
          />
        </UFormField>

        <div class="grid grid-cols-2 gap-4">
          <UFormField
            label="Species"
            :error="aiValidationAttempted && !form.species ? 'Required to generate with AI' : undefined"
          >
            <UInputMenu
              v-model="form.species"
              :items="SPECIES_OPTIONS"
              create-item
              class="w-full"
              placeholder="e.g. Elf"
              @create="onSpeciesCreate"
            />
          </UFormField>

          <UFormField
            label="Gender"
            :error="aiValidationAttempted && !form.gender.trim() ? 'Required to generate with AI' : undefined"
          >
            <UInput
              v-model="form.gender"
              class="w-full"
              placeholder="e.g. female"
            />
          </UFormField>

          <UFormField
            label="Age"
            :error="aiValidationAttempted && !form.age ? 'Required to generate with AI' : undefined"
          >
            <USelect
              v-model="form.age"
              :items="AGE_OPTIONS"
              class="w-full"
              placeholder="Select age"
            />
          </UFormField>

          <UFormField
            label="Occupation / role"
            :error="aiValidationAttempted && !form.role.trim() ? 'Required to generate with AI' : undefined"
          >
            <UInput
              v-model="form.role"
              class="w-full"
              placeholder="e.g. blacksmith"
            />
          </UFormField>
        </div>

        <UFormField
          label="Image"
        >
          <div class="flex items-center gap-3">
            <UFileUpload
              accept="image/*"
              label="Choose image"
              class="size-50 shrink-0"
              :ui="{ fileLeadingAvatar: '[&>img]:object-contain' }"
              @update:model-value="onImageFileChange"
            />
            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-sparkles"
              @click="openAiGenerator"
            >
              Generate with AI
            </UButton>
          </div>
        </UFormField>

        <UFormField
          v-if="form.images.length"
          label="Images"
          help="The highlighted image is shown. With more than one image you can switch from the NPC overview."
        >
          <div class="flex flex-col gap-2">
            <div
              v-for="entry in form.images"
              :key="entry.image"
              class="flex items-center gap-3"
            >
              <button
                type="button"
                class="shrink-0 rounded-full"
                :aria-label="`Show ${entry.label || 'this image'}`"
                @click="form.activeImage = entry.image"
              >
                <StoredAvatar
                  :image="entry.image"
                  :alt="entry.label"
                  size="lg"
                  :class="entry.image === form.activeImage ? 'ring-2 ring-primary' : 'opacity-60'"
                />
              </button>
              <UInput
                v-model="entry.label"
                class="flex-1"
                placeholder="e.g. Angry"
              />
              <UButton
                icon="i-lucide-trash-2"
                color="error"
                variant="ghost"
                :aria-label="`Remove ${entry.label || 'this image'}`"
                @click="removeImage(entry.image)"
              />
            </div>

            <UButton
              color="neutral"
              variant="subtle"
              icon="i-lucide-sparkles"
              class="self-start"
              :disabled="!activeImage"
              @click="variationGeneratorOpen = true"
            >
              Generate variation of highlighted image
            </UButton>
          </div>
        </UFormField>

        <UFormField label="Description">
          <RichTextEditor v-model="form.description" />
        </UFormField>
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
          :disabled="!form.name.trim()"
          @click="save"
        >
          Save
        </UButton>
      </div>
    </template>
  </UModal>

  <AiImageGeneratorModal
    v-model:open="aiGeneratorOpen"
    v-model:appearance-description="form.appearanceDescription"
    :species="form.species"
    :gender="form.gender"
    :age="form.age"
    :role="form.role"
    :current-image="activeImage"
    @accept="onAiImageAccepted"
  />

  <NpcVariationModal
    v-model:open="variationGeneratorOpen"
    :source="activeImage"
    @accept="onVariationAccepted"
  />
</template>
