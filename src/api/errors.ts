import * as E from 'fp-ts/Either'
import * as O from 'fp-ts/Option'
import * as RA from 'fp-ts/ReadonlyArray'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'
import { flow, pipe } from 'fp-ts/function'
import {
  ZodError,
  type ZodSafeParseResult,
  type ZodType,
} from 'zod'

import { absurd } from '../utils/absurd'

export type NetworkError = Readonly<{
  type: 'NetworkError'
  message: string
}>

export type HttpError = Readonly<{
  type: 'HttpError'
  status: number
}>

export type ValidationError = Readonly<{
  type: 'ValidationError'
  message: string
  issues: RNEA.ReadonlyNonEmptyArray<string>
}>

export type ApiError = NetworkError | HttpError | ValidationError

export const networkError = (message: string): NetworkError => ({
  type: 'NetworkError',
  message,
})

export const httpError = (status: number): HttpError => ({
  type: 'HttpError',
  status,
})

export const validationError = (
  message: string,
  issues: RNEA.ReadonlyNonEmptyArray<string>,
): ValidationError => ({
  type: 'ValidationError',
  message,
  issues,
})

export const matchApiError =
  <A>(
    onNetworkError: (error: NetworkError) => A,
    onHttpError: (error: HttpError) => A,
    onValidationError: (error: ValidationError) => A,
  ) =>
  (error: ApiError): A => {
    switch (error.type) {
      case 'NetworkError':
        return onNetworkError(error)
      case 'HttpError':
        return onHttpError(error)
      case 'ValidationError':
        return onValidationError(error)
      default:
        return absurd(error)
    }
  }

export const getApiErrorMessage = matchApiError(
  (error) => error.message,
  (error) => `Request failed with status ${error.status}`,
  (error) => error.message,
)

const getValidationIssues = flow(
  RA.map((issue: ZodError['issues'][number]) => issue.message),
  RNEA.fromReadonlyArray,
  O.getOrElse((): RNEA.ReadonlyNonEmptyArray<string> => {
    throw new Error('ZodError must contain at least one issue')
  }),
)

const safeParseResultToEither = <A>(
  result: ZodSafeParseResult<A>,
): E.Either<ZodError, A> =>
  result.success ? E.right(result.data) : E.left(result.error)

const isValidationIssues = (
  issues: unknown,
): issues is RNEA.ReadonlyNonEmptyArray<string> =>
  Array.isArray(issues) &&
  RA.isNonEmpty(issues) &&
  pipe(
    issues,
    RA.every((issue) => typeof issue === 'string'),
  )

export const isApiError = (error: unknown): error is ApiError => {
  if (typeof error !== 'object' || error === null || !('type' in error)) {
    return false
  }

  switch (error.type) {
    case 'NetworkError':
      return 'message' in error && typeof error.message === 'string'
    case 'HttpError':
      return 'status' in error && typeof error.status === 'number'
    case 'ValidationError':
      return (
        'message' in error &&
        typeof error.message === 'string' &&
        'issues' in error &&
        isValidationIssues(error.issues)
      )
    default:
      return false
  }
}

export const toApiError = (error: unknown): ApiError => {
  if (isApiError(error)) {
    return error
  }

  if (error instanceof Error) {
    return networkError(error.message)
  }

  return networkError('Network request failed')
}

export const toValidationError = (
  message: string,
  error: ZodError,
): ApiError => validationError(message, getValidationIssues(error.issues))

export const decodeWithSchema =
  <A>(schema: ZodType<A>, message: string) =>
  (data: unknown): E.Either<ApiError, A> =>
    pipe(
      schema.safeParse(data),
      safeParseResultToEither,
      E.mapLeft((error) => toValidationError(message, error)),
    )
