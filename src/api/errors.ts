import { ZodError } from 'zod'

export type ApiError =
  | {
      type: 'NetworkError'
      message: string
      status?: number
    }
  | {
      type: 'ValidationError'
      message: string
      issues: readonly string[]
    }

export const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null || !('type' in error)) {
    return false
  }

  return error.type === 'NetworkError' || error.type === 'ValidationError'
}

export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof Error) {
    return {
      type: 'NetworkError',
      message: error.message,
    }
  }

  return {
    type: 'NetworkError',
    message: 'Network request failed',
  }
}

export const toValidationError = (
  message: string,
  error: ZodError,
): ApiError => ({
  type: 'ValidationError',
  message,
  issues: error.issues.map(issue => issue.message),
})
