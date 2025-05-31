import { Array, Effect, pipe } from 'effect'
import { $ } from 'zx'

const widths = [16, 48, 96, 128, 256]

const generatePNG = Effect.fn('generatePNG')(function* (width: number) {
  yield* Effect.promise(() => $`rsvg-convert -w ${width} assets/logo.svg > assets/tmp/logo${width}.png`)
  yield* Effect.promise(
    () =>
      $`magick assets/tmp/logo${width}.png -resize ${width}x${width} -background none -gravity center -extent ${width}x${width} assets/logo${width}.png`,
  )
})

await pipe(
  widths,
  Array.map((width) => generatePNG(width)),
  Effect.allWith({ concurrency: 'unbounded' }),
  Effect.runPromise,
)

await $`magick -size 128x128 xc:transparent assets/canvas.png`
await $`magick assets/canvas.png assets/logo96.png -gravity center -composite assets/logo96-extent.png`
await $`rm assets/canvas.png`
await $`cp assets/logo.svg docs/public/favicon.svg`
await $`cp assets/logo.svg docs/src/assets/logo.svg`
