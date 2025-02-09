import { z } from 'zod'

export const SearchEngineMatchSchema = z.object({
  match: z.string(),
  originUrl: z.string(),
  isEnabledByDefault: z.boolean(),
  isEnabled: z.boolean(),
})

export type SearchEngineMatch = z.infer<typeof SearchEngineMatchSchema>

export const SupportSearchEngineSchema = z.object({
  name: z.string(),
  matches: z.array(SearchEngineMatchSchema),
})

export type SupportSearchEngine = z.infer<typeof SupportSearchEngineSchema>

export const SupportSearchEnginesSchema = z.array(SupportSearchEngineSchema)

export type SupportSearchEngines = z.infer<typeof SupportSearchEnginesSchema>
