import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { getCurrentTabUrl, isAllowUrl } from '../../utils'
import { Effect, pipe } from 'effect'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormField, FormItem, FormLabel } from '~/components/ui/form'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '~/components/ui/select'
import { useMemo } from 'react'
import { supportedEngines } from '~/lib/search-engines'
import { Button } from '~/components/ui/button'
import { useRequestUserSitePermission } from '../../hooks/request-user-site-permission'

export const Route = createFileRoute('/_search-engines/search-engines/apply')({
  component: RouteComponent,
  loader: async () => {
    return pipe(
      Effect.promise(() => getCurrentTabUrl()),
      Effect.filterOrFail(isAllowUrl, () => redirect({ to: '/search-engines' })),
      Effect.runPromise,
    )
  },
})

const enableFormSchema = z.object({
  searchEngine: z.string(),
})

type EnableForm = z.infer<typeof enableFormSchema>

function RouteComponent() {
  const url = Route.useLoaderData()
  const { requestUserSitePermission } = useRequestUserSitePermission()
  const availableSearchEngine = useMemo(() => supportedEngines.filter((engine) => engine.allowUserSites), [])
  const form = useForm<EnableForm>({
    resolver: zodResolver(enableFormSchema),
  })

  const navigate = useNavigate()
  async function onSubmit(values: EnableForm) {
    console.log('submit', values)

    await requestUserSitePermission({ id: values.searchEngine, url })
    navigate({ to: '/search-engines' })
  }
  return (
    <div>
      <p className="py-2">Enable on: {url}</p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="searchEngine"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Search Engine Type</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select the search engine type" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {availableSearchEngine.map((engine) => (
                        <SelectItem key={engine.id} value={engine.id}>
                          {engine.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit">Enable</Button>
        </form>
      </Form>
    </div>
  )
}
