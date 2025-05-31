import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { imageSizeFromFile } from 'image-size/fromFile'
import { expect, it } from 'vitest'

const __dirname = resolve(dirname(fileURLToPath(import.meta.url)))

it.each(['logo16.png', 'logo48.png', 'logo96.png', 'logo256.png'])(
  'icon should be square for Firefox: %s',
  async (filename) => {
    const filePath = resolve(__dirname, '..', filename)
    const size = await imageSizeFromFile(filePath)
    expect(
      size.height === size.width,
      `Image size ${size.width}x${size.height} is not square for Firefox: ${filename}`,
    ).toBe(true)
  },
)
