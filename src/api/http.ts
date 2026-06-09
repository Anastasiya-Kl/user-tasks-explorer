import * as E from 'fp-ts/Either'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

import { httpError, toApiError, type ApiError } from './errors'

const ensureSuccessfulResponse = E.fromPredicate(
  (response: Response) => response.ok,
  (response): ApiError => httpError(response.status),
)

const readJson = (response: Response): TE.TaskEither<ApiError, unknown> =>
  TE.tryCatch(
    (): Promise<unknown> => response.json(),
    toApiError,
  )

export const fetchJson = (
  url: string,
): TE.TaskEither<ApiError, unknown> =>
  pipe(
    TE.tryCatch(() => fetch(url), toApiError),
    TE.chainEitherK(ensureSuccessfulResponse),
    TE.chain(readJson),
  )
