import { pipe } from 'fp-ts/function'
import * as TE from 'fp-ts/TaskEither'

import { decodeWithSchema, type ApiError } from './errors'
import { fetchJson } from './http'
import { TodoSchema, type Todo } from '../types/todo'

const TODOS_URL = 'https://jsonplaceholder.typicode.com/todos'

const TodosSchema = TodoSchema.array()

const validateTodos = decodeWithSchema(
  TodosSchema,
  'Invalid todos response',
)

export const getTodos = (
  userId: number,
): TE.TaskEither<ApiError, ReadonlyArray<Todo>> =>
  pipe(
    fetchJson(`${TODOS_URL}?userId=${userId}`),
    TE.chainEitherK(validateTodos),
  )
