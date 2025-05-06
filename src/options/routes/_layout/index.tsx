import { ZodProvider } from '@autoform/zod'
import { createFileRoute } from '@tanstack/react-router'
import { useAtom } from 'jotai'
import { useCallback } from 'react'
import type { z } from 'zod'
import { optionsAtom } from '~/atoms/storage'
import { AutoForm } from '~/components/ui/autoform'
import { Button } from '~/components/ui/button'
import { useToast } from '~/hooks/use-toast'
import { InstanceOptionsSchema } from '~/schemas/options'
import { createClient } from '~/shared/client'

const schemaProvider = new ZodProvider(InstanceOptionsSchema)

export const Route = createFileRoute('/_layout/')({
  component: OptionsForm,
  wrapInSuspense: true,
})

function OptionsForm() {
  const [initialValues, setOptions] = useAtom(optionsAtom)
  const { toast } = useToast()
  console.log(initialValues)
  const handleSubmit = useCallback(
    async (data: z.infer<typeof InstanceOptionsSchema>) => {
      const client = createClient(data.url, data.apiKey)

      try {
        const res = await client.getLists()
        if (res.status !== 200) {
          toast({
            title: 'Invalid config, please check your config and try again.',
            description: `Expected status 200, but got ${res.status}`,
          })
          return
        }

        console.log(res)
      } catch (error) {
        toast({
          title: 'Invalid config, please check your config and try again.',
          description: (error as Error).message,
        })
        return
      }
      await setOptions(data)
      toast({
        title: 'Config Saved',
      })
    },
    [toast, setOptions],
  )

  return (
    <AutoForm schema={schemaProvider} defaultValues={initialValues} onSubmit={handleSubmit}>
      <Button type="submit">Save</Button>
    </AutoForm>
  )
}
