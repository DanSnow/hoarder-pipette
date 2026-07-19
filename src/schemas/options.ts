import { z } from 'zod/v4'

export const LooseOptionsSchema = z.object({
  url: z.string(),
  apiKey: z.string(),
})

export const InstanceOptionsSchema = z.object({
  url: z.url(),
  apiKey: z.string(),
})

export type InstanceOptions = z.infer<typeof InstanceOptionsSchema>
