import * as E from 'fp-ts/Either'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { fetchJson } from './http'
import { httpError, networkError } from './errors'

const mockResponse = (response: {
  ok: boolean
  status: number
  json?: () => Promise<unknown>
}): Response => response as Response

describe('fetchJson', () => {
  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('returns Right for a successful HTTP response', async () => {
    const payload = { ok: true }

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockResponse({
        ok: true,
        status: 200,
        json: () => Promise.resolve(payload),
      }),
    )

    const result = await fetchJson('https://example.com/data')()

    expect(E.isRight(result)).toBe(true)
    expect(result).toEqual(E.right(payload))
  })

  it('returns Left for a non-successful HTTP status', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockResponse({
        ok: false,
        status: 404,
      }),
    )

    const result = await fetchJson('https://example.com/missing')()

    expect(E.isLeft(result)).toBe(true)
    expect(result).toEqual(E.left(httpError(404)))
  })

  it('returns Left when fetch rejects', async () => {
    vi.spyOn(globalThis, 'fetch').mockRejectedValue(
      new Error('Failed to fetch'),
    )

    const result = await fetchJson('https://example.com/data')()

    expect(E.isLeft(result)).toBe(true)
    expect(result).toEqual(E.left(networkError('Failed to fetch')))
  })

  it('returns Left when response JSON cannot be read', async () => {
    vi.spyOn(globalThis, 'fetch').mockResolvedValue(
      mockResponse({
        ok: true,
        status: 200,
        json: () => Promise.reject(new Error('Invalid JSON')),
      }),
    )

    const result = await fetchJson('https://example.com/data')()

    expect(E.isLeft(result)).toBe(true)
    expect(result).toEqual(E.left(networkError('Invalid JSON')))
  })
})
