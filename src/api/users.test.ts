import * as E from 'fp-ts/Either'
import { afterEach, assert, describe, expect, it, vi } from 'vitest'

import { getUsers } from './users'
import type { User } from '../types/user'

const mockResponse = (payload: unknown): Response =>
  ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(payload),
  }) as Response

describe('getUsers', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns Right for a valid users payload', async () => {
    const users: ReadonlyArray<User> = [
      {
        id: 1,
        name: 'John Doe',
        username: 'john',
      },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(users))

    const result = await getUsers()()

    expect(E.isRight(result)).toBe(true)
    expect(result).toEqual(E.right(users))
  })

  it('returns Left for an invalid users payload', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockResponse([
        {
          id: '1',
        },
      ]),
    )

    const result = await getUsers()()

    expect(E.isLeft(result)).toBe(true)

    if (E.isLeft(result)) {
      assert(result.left.type === 'ValidationError')
      expect(result.left.message).toBe('Invalid users response')
      expect(result.left.issues.length).toBeGreaterThan(0)
      expect(result.left.issues[0]).toEqual(expect.any(String))
    }
  })
})
