const API_BASE_V1 = 'https://cloud.leonardo.ai/api/rest/v1'
const API_BASE_V2 = 'https://cloud.leonardo.ai/api/rest/v2'
const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 90000
const LOOKS_LIKE_REFERENCE_STRENGTH = 'MID'
const GENERATION_SIZE = 1024
const MODEL = 'flux-pro-2.0'

export interface NpcImagePrompt {
  species: string
  gender: string
  age: string
  role: string
  description: string
  looksLikeGeneratedImageId?: string
}

export interface GeneratedNpcImage {
  image: string
  leonardoImageId: string
}

export async function generateLeonardoNpcImage(apiKey: string, promptInput: NpcImagePrompt): Promise<GeneratedNpcImage> {
  const prompt = buildPrompt(promptInput)
  const generationId = await startGeneration(apiKey, prompt, promptInput.looksLikeGeneratedImageId ?? null)
  const generatedImage = await pollForGeneratedImage(apiKey, generationId)
  const imageResponse = await fetch(generatedImage.url)

  if (!imageResponse.ok) {
    throw new Error(`Failed to download generated image (${imageResponse.status})`)
  }

  return { image: await convertImageFileToWebp(await imageResponse.blob()), leonardoImageId: generatedImage.id }
}

function buildPrompt({ species, gender, age, role, description }: NpcImagePrompt): string {
  const subject = [age, gender, role].map(part => part.trim()).filter(Boolean).join(' ')
  const base = `Portrait of a ${subject || 'fantasy character'}, ${species} species, D&D character art, torso, isolated image, white background, detailed`

  return description.trim() ? `${base}. ${description.trim()}` : base
}

function authHeaders(apiKey: string): Record<string, string> {
  return { Authorization: `Bearer ${apiKey}` }
}

async function startGeneration(
  apiKey: string,
  prompt: string,
  looksLikeGeneratedImageId: string | null
): Promise<string> {
  const parameters: Record<string, unknown> = {
    prompt,
    quantity: 1,
    width: GENERATION_SIZE,
    height: GENERATION_SIZE,
    prompt_enhance: 'OFF'
  }

  if (looksLikeGeneratedImageId) {
    parameters.guidances = {
      image_reference: [{
        image: { id: looksLikeGeneratedImageId, type: 'GENERATED' },
        strength: LOOKS_LIKE_REFERENCE_STRENGTH
      }]
    }
  }

  const response = await fetch(`${API_BASE_V2}/generations`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...authHeaders(apiKey) },
    body: JSON.stringify({ public: false, model: MODEL, parameters })
  })

  if (!response.ok) {
    throw new Error(`Leonardo API error starting generation (${response.status})`)
  }

  const body = await response.json() as { generate?: { generationId?: string } }
  const generationId = body.generate?.generationId

  if (!generationId) {
    throw new Error('Leonardo API did not return a generation id')
  }

  return generationId
}

interface GenerationStatusResponse {
  generations_by_pk?: {
    status?: string
    generated_images?: { url: string, id: string }[]
  }
}

async function pollForGeneratedImage(apiKey: string, generationId: string): Promise<{ url: string, id: string }> {
  const deadline = Date.now() + POLL_TIMEOUT_MS

  while (Date.now() < deadline) {
    const response = await fetch(`${API_BASE_V1}/generations/${generationId}`, { headers: authHeaders(apiKey) })

    if (!response.ok) {
      throw new Error(`Leonardo API error checking generation status (${response.status})`)
    }

    const body = await response.json() as GenerationStatusResponse
    const generation = body.generations_by_pk

    if (generation?.status === 'COMPLETE') {
      const generatedImage = generation.generated_images?.[0]

      if (!generatedImage?.url || !generatedImage.id) {
        throw new Error('Leonardo API completed generation without an image')
      }

      return generatedImage
    }

    if (generation?.status === 'FAILED') {
      throw new Error('Leonardo image generation failed')
    }

    await sleep(POLL_INTERVAL_MS)
  }

  throw new Error('Timed out waiting for Leonardo image generation')
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}
