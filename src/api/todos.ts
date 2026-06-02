import * as E from 'fp-ts/Either'
import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import { toApiError, toValidationError, type ApiError } from './errors'
import { TodoSchema, type Todo } from '../types/todo'

const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

const TodosSchema = TodoSchema.array()

const validateTodos = (data: unknown): E.Either<ApiError, Todo[]> =>
  pipe(
    TodosSchema.safeParse(data),
    result =>
      result.success
        ? E.right(result.data)
        : E.left(toValidationError('Invalid todos response', result.error)),
  )

export const getTodos = (userId: number): TE.TaskEither<ApiError, Todo[]> =>
  pipe(
    TE.tryCatch(async () => {
      const response = await fetch(`${TODOS_URL}?userId=${userId}`)

      if (!response.ok) {
        return Promise.reject<ApiError>({
          type: 'NetworkError',
          message: `Request failed with status ${response.status}`,
          status: response.status,
        })
      }

      return response.json()
    }, toApiError),
    TE.chainEitherKW(validateTodos),
  )
