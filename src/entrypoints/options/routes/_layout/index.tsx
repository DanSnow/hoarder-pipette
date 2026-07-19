import { useForm } from '@tanstack/react-form'
import { createFileRoute } from '@tanstack/react-router'
import { Effect, pipe } from 'effect'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { toast } from 'sonner'
import { joinURL, withTrailingSlash } from 'ufo'

import { optionsAtom } from '~/atoms/storage'
import { Button } from '~/components/ui/button'
import { Field, FieldError, FieldLabel } from '~/components/ui/field'
import { Input } from '~/components/ui/input'
import { toOriginUrl } from '~/lib/utils'
import { InstanceOptionsSchema, type InstanceOptions } from '~/schemas/options'

import { requestOrigin } from '../../permission'

export const Route = createFileRoute('/_layout/')({
  component: OptionsForm,
  wrapInSuspense: true,
})

function OptionsForm() {
  const { queryClient, orpc } = Route.useRouteContext()
  const [initialValues, setOptions] = useAtom(optionsAtom)
  const handleSubmit = useCallback(
    async (data: InstanceOptions) => {
      try {
        await pipe(data.url, withTrailingSlash, toOriginUrl, requestOrigin, Effect.runPromise)

        const res = await queryClient.fetchQuery(orpc.checkInstance.queryOptions({ input: data }))

        if (res.ok) {
          await setOptions(data)
          toast('Config Saved')
          return
        }

        toast('Invalid config, please check your config and try again.', {
          description: res.message || `Expected status 200, but got ${res.status}`,
        })
        return
      } catch (error) {
        toast('Invalid config, please check your config and try again.', {
          description: (error as Error).message,
        })
        return
      }
    },
    [setOptions, queryClient, orpc],
  )

  const form = useForm({
    defaultValues: initialValues,
    validators: { onChange: InstanceOptionsSchema },
    onSubmit: async ({ value }) => {
      await handleSubmit(value)
    },
  })

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault()
        form.handleSubmit()
      }}
      className="space-y-8"
    >
      <form.Field name="url">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>URL</FieldLabel>
              <div className="flex gap-1">
                <Input
                  id={field.name}
                  name={field.name}
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  onBlur={field.handleBlur}
                  aria-invalid={isInvalid}
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={!field.state.value}
                  onClick={() => {
                    window.open(joinURL(field.state.value, '/settings/api-keys'), '_blank')
                  }}
                >
                  <span className="i-lucide-key" />
                </Button>
              </div>
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )
        }}
      </form.Field>
      <form.Field name="apiKey">
        {(field) => {
          const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid
          return (
            <Field data-invalid={isInvalid}>
              <FieldLabel htmlFor={field.name}>API Key</FieldLabel>
              <Input
                id={field.name}
                name={field.name}
                type="password"
                value={field.state.value}
                onChange={(e) => field.handleChange(e.target.value)}
                onBlur={field.handleBlur}
                aria-invalid={isInvalid}
              />
              <FieldError errors={field.state.meta.errors} />
            </Field>
          )
        }}
      </form.Field>
      <Button type="submit">Save</Button>
    </form>
  )
}
