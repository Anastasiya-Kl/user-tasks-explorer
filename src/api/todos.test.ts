import * as E from 'fp-ts/Either'
import { afterEach, assert, describe, expect, it, vi } from 'vitest'

import { getTodos } from './todos'
import type { Todo } from '../types/todo'

const mockResponse = (payload: unknown): Response =>
  ({
    ok: true,
    status: 200,
    json: () => Promise.resolve(payload),
  }) as Response

describe('getTodos', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns Right for a valid todos payload', async () => {
    const todos: ReadonlyArray<Todo> = [
      {
        id: 1,
        userId: 1,
        title: 'Buy milk',
        completed: false,
      },
    ]

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(mockResponse(todos))

    const result = await getTodos(1)()

    expect(E.isRight(result)).toBe(true)
    expect(result).toEqual(E.right(todos))
    expect(globalThis.fetch).toHaveBeenCalledWith(
      'https://jsonplaceholder.typicode.com/todos?userId=1',
    )
  })

  it('returns Left for an invalid todos payload', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockResponse([
        {
          id: '1',
        },
      ]),
    )

    const result = await getTodos(1)()

    expect(E.isLeft(result)).toBe(true)

    if (E.isLeft(result)) {
      assert(result.left.type === 'ValidationError')
      expect(result.left.message).toBe('Invalid todos response')
      expect(result.left.issues.length).toBeGreaterThan(0)
    }
  })
})
