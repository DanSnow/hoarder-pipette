import { initTRPC } from '@trpc/server'
import { describe, expect, it, vi } from 'vitest'
import { createMessageHandler } from '../adapter'

const t = initTRPC.create({
  isServer: false,
  allowOutsideOfServer: true,
})

describe('createMessageHandler', () => {
  it('can handle messages', async () => {
    const test = vi.fn().mockResolvedValue('response')
    const router = t.router({
      test: t.procedure.query(test),
    })

    const handler = createMessageHandler(router)
    const res = await handler({ id: 1, path: 'test', input: undefined, type: 'query' })

    expect(test).toHaveBeenCalled()
    expect(res).toBe('response')
  })
})
