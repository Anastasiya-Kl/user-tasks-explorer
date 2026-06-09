import { useQuery } from '@tanstack/react-query'
import * as O from 'fp-ts/Option'
import * as TE from 'fp-ts/TaskEither'
import { pipe } from 'fp-ts/function'

import { networkError, type ApiError } from '../api/errors'
import { getTodos } from '../api/todos'
import type { Todo } from '../types/todo'
import { taskEitherToPromise } from '../utils/taskEither'

export const useTodos = (userId: O.Option<number>) =>
  useQuery<ReadonlyArray<Todo>, ApiError>({
    queryKey: ['todos', userId],
    enabled: O.isSome(userId),
    staleTime: 5 * 60 * 1000,
    queryFn: () =>
      pipe(
        userId,
        O.match(
          () =>
            TE.left<ApiError, ReadonlyArray<Todo>>(
              networkError('User id is required'),
            ),
          getTodos,
        ),
        taskEitherToPromise,
      ),
  })
