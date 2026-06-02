import { useQuery } from '@tanstack/react-query'
import * as E from 'fp-ts/Either'

import type { ApiError } from '../api/errors'
import { getTodos } from '../api/todos'
import type { Todo } from '../types/todo'

export const useTodos = (userId: number | null | undefined) =>
  useQuery<Todo[], ApiError>({
    queryKey: ['todos', userId],
    enabled: userId != null,
    staleTime: 5 * 60 * 1000,
    queryFn: async () => {

      if (userId == null) {
        throw {
          type: 'NetworkError',
          message: 'User id is required',
        }
      }

      const result = await getTodos(userId)()

      if (E.isLeft(result)) {
        throw result.left
      }

      return result.right
    },
  })
