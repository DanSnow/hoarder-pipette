import { useForm } from '@tanstack/react-form'
import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router'
import { Effect, pipe } from 'effect'
import { useMemo } from 'react'
import { z } from 'zod/v4'

import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '~/components/ui/select'
import { supportedEngines } from '~/lib/search-engines'

import { useRequestUserSitePermission } from '../../hooks/request-user-site-permission'
import { getCurrentTabUrl, isAllowUrl } from '../../utils'

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
  const navigate = useNavigate()

  const form = useForm({
    defaultValues: { searchEngine: '' } satisfies EnableForm,
    validators: { onSubmit: enableFormSchema },
    onSubmit: async ({ value }) => {
      await requestUserSitePermission({ id: value.searchEngine, url })
      navigate({ to: '/search-engines' })
    },
  })

  return (
    <div>
      <p className="py-2">Enable on: {url}</p>
      <form
        onSubmit={(e) => {
          e.preventDefault()
          form.handleSubmit()
        }}
        className="space-y-8"
      >
        <form.Field name="searchEngine">
          {(field) => {
            const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
            return (
              <Field data-invalid={isInvalid}>
                <FieldLabel htmlFor={field.name}>Search Engine Type</FieldLabel>
                <Select value={field.state.value} onValueChange={(value) => field.handleChange(value ?? '')}>
                  <SelectTrigger id={field.name} aria-invalid={isInvalid}>
                    <SelectValue placeholder="Select the search engine type" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableSearchEngine.map((engine) => (
                      <SelectItem key={engine.id} value={engine.id}>
                        {engine.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )
          }}
        </form.Field>
        <Button type="submit">Enable</Button>
      </form>
    </div>
  )
}
