export async function convertImageFileToWebp(
  file: File | Blob,
  { maxDimension = 1024, quality = 0.8 }: { maxDimension?: number, quality?: number } = {}
): Promise<string> {
  const objectUrl = URL.createObjectURL(file)

  try {
    const img = await loadImage(objectUrl)
    const scale = Math.min(1, maxDimension / Math.max(img.width, img.height))
    const width = Math.round(img.width * scale)
    const height = Math.round(img.height * scale)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const ctx = canvas.getContext('2d')
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable')
    }

    ctx.drawImage(img, 0, 0, width, height)
    return canvas.toDataURL('image/webp', quality)
  } finally {
    URL.revokeObjectURL(objectUrl)
  }
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })
}
