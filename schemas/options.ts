import { fieldConfig } from '@autoform/zod/v4'
import { z } from 'zod/v4'

export const LooseOptionsSchema = z.object({
  url: z.string(),
  apiKey: z.string(),
})

export const InstanceOptionsSchema = z.object({
  url: z.url().register(
    ...fieldConfig({
      label: 'URL',
      fieldType: 'urlWithApiLink',
      description: 'Your Karakeep instance URL',
    }),
  ),
  apiKey: z.string().register(
    ...fieldConfig({
      label: 'API Key',
      description: 'Your API key',
      inputProps: {
        type: 'password',
      },
    }),
  ),
})

export type InstanceOptions = z.infer<typeof InstanceOptionsSchema>
