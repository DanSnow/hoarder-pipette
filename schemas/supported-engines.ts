import { z } from 'zod/v4'

export const SearchEngineMatchSchema = z.object({
  match: z.string(),
  originUrl: z.string(),
  isEnabledByDefault: z.boolean(),
  isEnabled: z.boolean(),
})

export type SearchEngineMatch = z.infer<typeof SearchEngineMatchSchema>

export const SupportSearchEngineSchema = z.object({
  id: z.string(),
  name: z.string(),
  icon: z.string(),
  allowUserSites: z.boolean(),
  matches: z.array(SearchEngineMatchSchema),
})

export type SupportSearchEngine = z.infer<typeof SupportSearchEngineSchema>

export const SupportSearchEnginesSchema = z.array(SupportSearchEngineSchema)

export type SupportSearchEngines = z.infer<typeof SupportSearchEnginesSchema>
