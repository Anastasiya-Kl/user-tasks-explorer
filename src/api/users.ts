import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import { toApiError, toValidationError, type ApiError } from './errors'
import { UserSchema, type User } from '../types/user'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

const UsersSchema = UserSchema.array()

const validateUsers = (data: unknown): E.Either<ApiError, User[]> =>
  pipe(
    UsersSchema.safeParse(data),
    result =>
      result.success
        ? E.right(result.data)
        : E.left(toValidationError('Invalid users response', result.error)),
  )

export const getUsers = (): TE.TaskEither<ApiError, User[]> =>
  pipe(
    TE.tryCatch(async () => {
      const response = await fetch(USERS_URL)

      if (!response.ok) {
        return Promise.reject<ApiError>({
          type: 'NetworkError',
          message: `Request failed with status ${response.status}`,
          status: response.status,
        })
      }

      return response.json()
    }, toApiError),
    TE.chainEitherKW(validateUsers),
  )
