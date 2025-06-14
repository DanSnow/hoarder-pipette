import { ZodProvider } from '@autoform/zod'
import { createFileRoute } from '@tanstack/react-router'
import { Effect, pipe } from 'effect'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import { withTrailingSlash } from 'ufo'
import type { z } from 'zod'
import { optionsAtom } from '~/atoms/storage'
import { AutoForm } from '~/components/ui/autoform'
import { Button } from '~/components/ui/button'
import { useToast } from '~/hooks/use-toast'
import { toOriginUrl } from '~/lib/utils'
import { InstanceOptionsSchema } from '~/schemas/options'
import { requestOrigin } from '../../permission'

const schemaProvider = new ZodProvider(InstanceOptionsSchema)

export const Route = createFileRoute('/_layout/')({
  component: OptionsForm,
  wrapInSuspense: true,
})

function OptionsForm() {
  const { queryClient, trpc } = Route.useRouteContext()
  const [initialValues, setOptions] = useAtom(optionsAtom)
  const { toast } = useToast()
  console.log(initialValues)
  const handleSubmit = useCallback(
    async (data: z.infer<typeof InstanceOptionsSchema>) => {
      try {
        await pipe(data.url, withTrailingSlash, toOriginUrl, requestOrigin, Effect.runPromise)

        const res = await queryClient.fetchQuery(trpc.checkInstance.queryOptions(data))

        console.log(res)
        if (res.ok) {
          await setOptions(data)
          toast({
            title: 'Config Saved',
          })
          return
        }

        toast({
          title: 'Invalid config, please check your config and try again.',
          description: res.message || `Expected status 200, but got ${res.status}`,
        })
        return
      } catch (error) {
        toast({
          title: 'Invalid config, please check your config and try again.',
          description: (error as Error).message,
        })
        return
      }
    },
    [toast, setOptions, queryClient, trpc],
  )

  return (
    <AutoForm schema={schemaProvider} defaultValues={initialValues} onSubmit={handleSubmit}>
      <Button type="submit">Save</Button>
    </AutoForm>
  )
}
