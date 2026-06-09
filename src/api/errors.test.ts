import { describe, expect, it } from 'vitest'

import {
  getApiErrorMessage,
  httpError,
  isApiError,
  networkError,
  validationError,
} from './errors'

describe('ApiError', () => {
  it('derives display messages exhaustively', () => {
    expect(getApiErrorMessage(networkError('Failed to fetch'))).toBe(
      'Failed to fetch',
    )
    expect(getApiErrorMessage(httpError(404))).toBe(
      'Request failed with status 404',
    )
    expect(
      getApiErrorMessage(
        validationError('Invalid users response', ['Invalid response']),
      ),
    ).toBe('Invalid users response')
  })

  it('rejects malformed tagged values', () => {
    expect(isApiError({ type: 'NetworkError' })).toBe(false)
    expect(isApiError({ type: 'HttpError', status: '404' })).toBe(false)
    expect(
      isApiError({
        type: 'ValidationError',
        message: 'Invalid response',
        issues: [],
      }),
    ).toBe(false)
  })
})
