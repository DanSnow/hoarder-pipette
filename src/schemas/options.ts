import { fieldConfig } from '@autoform/zod'
import { z } from 'zod/v4'

export const LooseOptionsSchema = z.object({
  url: z.string(),
  apiKey: z.string(),
})

export const InstanceOptionsSchema = z.object({
  url: z.url().check(
    fieldConfig({
      label: 'URL',
      fieldType: 'urlWithApiLink',
      description: 'Your Karakeep instance URL',
    }),
  ),
  apiKey: z.string().check(
    fieldConfig({
      label: 'API Key',
      description: 'Your API key',
      inputProps: {
        type: 'password',
      },
    }),
  ),
})

export type InstanceOptions = z.infer<typeof InstanceOptionsSchema>
