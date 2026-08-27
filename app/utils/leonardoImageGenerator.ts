const API_BASE_V1 = 'https://cloud.leonardo.ai/api/rest/v1'
const API_BASE_V2 = 'https://cloud.leonardo.ai/api/rest/v2'
const MODEL = 'flux-pro-2.0'
const POLL_INTERVAL_MS = 2000
const POLL_TIMEOUT_MS = 90000

export interface NpcImagePrompt {
  race: string
  gender: string
  age: string
  role: string
  description: string
}

interface GenerationJobResponse {
  generate?: { generationId?: string }
}

interface GenerationStatusResponse {
  generations_by_pk?: {
    status?: string
    generated_images?: { url: string }[]
  }
}

export async function generateLeonardoNpcImage(apiKey: string, promptInput: NpcImagePrompt): Promise<string> {
  const prompt = buildPrompt(promptInput)
  const generationId = await startGeneration(apiKey, prompt)
  const imageUrl = await pollForImageUrl(apiKey, generationId)
  const imageResponse = await fetch(imageUrl)

  if (!imageResponse.ok) {
    throw new Error(`Failed to download generated image (${imageResponse.status})`)
  }

  return convertImageFileToWebp(await imageResponse.blob())
}

function buildPrompt({ race, gender, age, role, description }: NpcImagePrompt): string {
  const subject = [age, gender, race, role].map(part => part.trim()).filter(Boolean).join(' ')
  const base = `Portrait of a ${subject || 'fantasy character'}, D&D character art, torso, isolated image, white background, detailed, high quality`

  return description.trim() ? `${base}. ${description.trim()}` : base
}

async function startGeneration(apiKey: string, prompt: string): Promise<string> {
  const response = await fetch(`${API_BASE_V2}/generations`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      public: false,
      model: MODEL,
      parameters: {
        prompt,
        quantity: 1,
        width: 512,
        height: 512,
        prompt_enhance: 'OFF'
      }
    })
  })

  if (!response.ok) {
    throw new Error(`Leonardo API error starting generation (${response.status})`)
  }

  const body = await response.json() as GenerationJobResponse
  const generationId = body.generate?.generationId

  if (!generationId) {
    throw new Error('Leonardo API did not return a generation id')
  }

  return generationId
}

async function pollForImageUrl(apiKey: string, generationId: string): Promise<string> {
  const deadline = Date.now() + POLL_TIMEOUT_MS

  while (Date.now() < deadline) {
    const response = await fetch(`${API_BASE_V1}/generations/${generationId}`, {
      headers: { Authorization: `Bearer ${apiKey}` }
    })

    if (!response.ok) {
      throw new Error(`Leonardo API error checking generation status (${response.status})`)
    }

    const body = await response.json() as GenerationStatusResponse
    const generation = body.generations_by_pk

    if (generation?.status === 'COMPLETE') {
      const url = generation.generated_images?.[0]?.url

      if (!url) {
        throw new Error('Leonardo API completed generation without an image')
      }

      return url
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
