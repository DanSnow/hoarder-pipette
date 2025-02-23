import { z } from 'zod'

export const UserSiteSchema = z.object({
  id: z.string(),
  url: z.string(),
})

export type UserSite = z.infer<typeof UserSiteSchema>

export const UserSitesSchema = z.array(UserSiteSchema)
