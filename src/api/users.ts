import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import { decodeWithSchema, type ApiError } from './errors'
import { fetchJson } from './http'
import { UserSchema, type User } from '../types/user'

const USERS_URL = 'https://jsonplaceholder.typicode.com/users'

const UsersSchema = UserSchema.array()

const validateUsers = decodeWithSchema(
  UsersSchema,
  'Invalid users response',
)

export const getUsers = (): TE.TaskEither<ApiError, ReadonlyArray<User>> =>
  pipe(
    fetchJson(USERS_URL),
    TE.chainEitherK(validateUsers),
  )
